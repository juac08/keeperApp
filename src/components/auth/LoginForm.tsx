import React, { useState } from "react";
import { Box, Stack, Text, Field, HStack, Heading } from "@chakra-ui/react";
import { FiZap, FiLayers, FiTarget, FiArrowRight } from "react-icons/fi";
import { AppButton, AppInput } from "@/ui";
import { useLoginMutation, useRegisterMutation } from "@/store";
import { appToaster } from "@/shared";

const FeatureCard: React.FC<{
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  desc: string;
}> = ({ icon, iconBg, title, desc }) => (
  <HStack
    gap={3}
    p={3}
    borderRadius="xl"
    bg="bg.panel"
    border="1px solid"
    borderColor="border.muted"
    transition="all 0.2s ease"
    _hover={{
      borderColor: "blue.200",
      transform: "translateY(-1px)",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)",
    }}
  >
    <Box
      w="36px"
      h="36px"
      borderRadius="10px"
      bg={iconBg}
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexShrink={0}
    >
      {icon}
    </Box>
    <Box>
      <Text fontSize="sm" fontWeight="600" color="text.primary">
        {title}
      </Text>
      <Text fontSize="xs" color="text.muted">
        {desc}
      </Text>
    </Box>
  </HStack>
);

export const LoginForm: React.FC<{ onSuccess: () => void }> = ({
  onSuccess,
}) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const [login, { isLoading: isLoginLoading }] = useLoginMutation();
  const [register, { isLoading: isRegisterLoading }] = useRegisterMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isLogin) {
        await login({ email, password }).unwrap();
        appToaster.success({ title: "Welcome back" });
      } else {
        await register({ email, password, name }).unwrap();
        appToaster.success({ title: "Account created" });
      }
      onSuccess();
    } catch (error: any) {
      const rawError = error?.data?.error;
      const description =
        typeof rawError === "string"
          ? rawError
          : typeof rawError?.message === "string"
            ? rawError.message
            : error?.message || "Please try again";
      appToaster.error({
        title: "Authentication failed",
        description,
      });
    }
  };

  return (
    <Box minH="100vh" bg="bg.canvas" position="relative" overflow="hidden">
      {/* Subtle gradient mesh background */}
      <Box
        position="absolute"
        inset={0}
        bgGradient="radial(circle at 0% 0%, rgba(59, 130, 246, 0.08), transparent 50%), radial(circle at 100% 0%, rgba(99, 102, 241, 0.06), transparent 50%), radial(circle at 50% 100%, rgba(59, 130, 246, 0.05), transparent 50%)"
      />

      {/* Floating orbs — subtle */}
      <Box
        position="absolute"
        top="-80px"
        right="-60px"
        w="240px"
        h="240px"
        borderRadius="full"
        bg="rgba(59, 130, 246, 0.06)"
        filter="blur(60px)"
        animation="floatA 18s ease-in-out infinite"
      />
      <Box
        position="absolute"
        bottom="-100px"
        left="-40px"
        w="200px"
        h="200px"
        borderRadius="full"
        bg="rgba(99, 102, 241, 0.06)"
        filter="blur(60px)"
        animation="floatB 20s ease-in-out infinite"
      />

      <Box
        minH="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        px={4}
        py={8}
        position="relative"
      >
        <Box
          w="full"
          maxW="1000px"
          display="grid"
          gridTemplateColumns={{ base: "1fr", lg: "1fr 1fr" }}
          gap={{ base: 8, lg: 16 }}
          alignItems="center"
          animation="fadeInUp 0.5s ease-out"
        >
          {/* Left — Brand & features */}
          <Box display={{ base: "none", lg: "block" }}>
            <HStack gap={2.5} mb={8} align="center">
              <Box
                w="36px"
                h="36px"
                borderRadius="12px"
                bg="linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)"
                color="white"
                display="flex"
                alignItems="center"
                justifyContent="center"
                fontSize="16px"
                fontWeight="800"
                boxShadow="0 4px 14px rgba(59, 130, 246, 0.3)"
              >
                K
              </Box>
              <Text
                fontSize="xl"
                fontWeight="700"
                color="text.primary"
                letterSpacing="-0.02em"
              >
                Keeper
              </Text>
            </HStack>

            <Heading
              size="2xl"
              color="text.primary"
              letterSpacing="-0.03em"
              lineHeight="1.15"
              mb={4}
              fontWeight="800"
            >
              Organize work
              <br />
              with clarity.
            </Heading>
            <Text
              fontSize="md"
              color="text.muted"
              maxW="380px"
              mb={8}
              lineHeight="1.7"
            >
              Create boards, track tasks, and collaborate with your team — all
              in one focused workspace.
            </Text>

            <Stack gap={3}>
              <FeatureCard
                icon={<FiZap size={16} color="#3b82f6" />}
                iconBg="rgba(59, 130, 246, 0.1)"
                title="Lightning fast boards"
                desc="Drag & drop cards in real-time"
              />
              <FeatureCard
                icon={<FiLayers size={16} color="#8b5cf6" />}
                iconBg="rgba(139, 92, 246, 0.1)"
                title="Structured workflow"
                desc="Todo → In Progress → Done"
              />
              <FeatureCard
                icon={<FiTarget size={16} color="#10b981" />}
                iconBg="rgba(16, 185, 129, 0.1)"
                title="Priority focused"
                desc="Always know what matters most"
              />
            </Stack>
          </Box>

          {/* Right — Auth form */}
          <Box>
            {/* Mobile logo */}
            <HStack
              gap={2.5}
              mb={6}
              align="center"
              display={{ base: "flex", lg: "none" }}
              justify="center"
            >
              <Box
                w="32px"
                h="32px"
                borderRadius="10px"
                bg="linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)"
                color="white"
                display="flex"
                alignItems="center"
                justifyContent="center"
                fontSize="14px"
                fontWeight="800"
                boxShadow="0 4px 14px rgba(59, 130, 246, 0.3)"
              >
                K
              </Box>
              <Text fontSize="lg" fontWeight="700" color="text.primary">
                Keeper
              </Text>
            </HStack>

            <Box
              bg="bg.panel"
              p={{ base: 6, md: 8 }}
              borderRadius="2xl"
              boxShadow="0 1px 3px rgba(0, 0, 0, 0.04), 0 12px 40px rgba(0, 0, 0, 0.06)"
              border="1px solid"
              borderColor="border.muted"
            >
              <Stack gap={6}>
                <Box>
                  <Heading
                    size="lg"
                    color="text.primary"
                    letterSpacing="-0.02em"
                    fontWeight="700"
                  >
                    {isLogin ? "Welcome back" : "Create account"}
                  </Heading>
                  <Text fontSize="sm" color="text.muted" mt={1.5}>
                    {isLogin
                      ? "Sign in to continue to your workspace"
                      : "Get started with Keeper in seconds"}
                  </Text>
                </Box>

                <form onSubmit={handleSubmit}>
                  <Stack gap={4}>
                    {!isLogin && (
                      <Field.Root>
                        <Field.Label
                          fontSize="sm"
                          fontWeight="500"
                          color="text.secondary"
                          mb={1}
                        >
                          Name
                        </Field.Label>
                        <AppInput
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="John Doe"
                          required={!isLogin}
                        />
                      </Field.Root>
                    )}

                    <Field.Root>
                      <Field.Label
                        fontSize="sm"
                        fontWeight="500"
                        color="text.secondary"
                        mb={1}
                      >
                        Email
                      </Field.Label>
                      <AppInput
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        required
                      />
                    </Field.Root>

                    <Field.Root>
                      <Field.Label
                        fontSize="sm"
                        fontWeight="500"
                        color="text.secondary"
                        mb={1}
                      >
                        Password
                      </Field.Label>
                      <AppInput
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                      />
                    </Field.Root>

                    <AppButton
                      type="submit"
                      variantStyle="primary"
                      w="full"
                      mt={1}
                      loading={isLoginLoading || isRegisterLoading}
                      h="44px"
                    >
                      <HStack gap={2}>
                        <Text>{isLogin ? "Sign In" : "Create Account"}</Text>
                        <FiArrowRight size={16} />
                      </HStack>
                    </AppButton>
                  </Stack>
                </form>

                <HStack justify="center" gap={1} pt={1}>
                  <Text fontSize="sm" color="text.muted">
                    {isLogin
                      ? "Don't have an account?"
                      : "Already have an account?"}
                  </Text>
                  <Text
                    fontSize="sm"
                    color="brand.500"
                    cursor="pointer"
                    fontWeight="600"
                    onClick={() => setIsLogin(!isLogin)}
                    _hover={{ color: "brand.600" }}
                    transition="color 0.15s ease"
                  >
                    {isLogin ? "Sign up" : "Sign in"}
                  </Text>
                </HStack>
              </Stack>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
