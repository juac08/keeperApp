import React, { useState } from "react";
import { Box, Stack, Text, Field, HStack, Heading } from "@chakra-ui/react";
import { FiZap, FiLayers, FiTarget } from "react-icons/fi";
import { AppButton, AppInput } from "@/ui";
import { useLoginMutation, useRegisterMutation } from "@/store";
import { appToaster } from "@/shared";

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
      appToaster.error({
        title: "Authentication failed",
        description: error?.data?.error || error.message || "Please try again",
      });
    }
  };

  return (
      <Box minH="100vh" bg="bg.canvas" position="relative" overflow="hidden">
      <Box
        position="absolute"
        inset={0}
          bgGradient="radial(circle at 10% 10%, rgba(31, 134, 220, 0.24), transparent 45%), radial(circle at 90% 15%, rgba(114, 187, 255, 0.22), transparent 40%), radial(circle at 50% 90%, rgba(124, 58, 237, 0.18), transparent 45%)"
        />
        <Box
          position="absolute"
          top="-120px"
          right="-120px"
          w="280px"
          h="280px"
          borderRadius="full"
          bg="rgba(31, 134, 220, 0.14)"
          filter="blur(1px)"
          animation="floatA 12s ease-in-out infinite"
        />
        <Box
          position="absolute"
          bottom="-140px"
          left="-80px"
          w="260px"
          h="260px"
          borderRadius="full"
          bg="rgba(114, 187, 255, 0.14)"
          animation="floatB 14s ease-in-out infinite"
        />
        <Box
          position="absolute"
          top="20%"
          left="55%"
          w="180px"
          h="180px"
          borderRadius="full"
          bg="rgba(124, 58, 237, 0.12)"
          filter="blur(4px)"
          animation="floatC 16s ease-in-out infinite"
          display={{ base: "none", lg: "block" }}
        />

      <Box
        minH="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        px={4}
        position="relative"
      >
        <Box
          w="full"
          maxW="980px"
          display="grid"
          gridTemplateColumns={{ base: "1fr", lg: "1.2fr 1fr" }}
          gap={{ base: 8, lg: 12 }}
          alignItems="center"
        >
          <Box>
            <HStack
              gap={2}
              mb={6}
              align="center"
              color="text.primary"
              fontWeight="700"
            >
              <Box
                w="28px"
                h="28px"
                borderRadius="10px"
                bg="brand.600"
                color="white"
                display="flex"
                alignItems="center"
                justifyContent="center"
                fontSize="16px"
                boxShadow="0 10px 20px rgba(31, 134, 220, 0.3)"
              >
                K
              </Box>
              <Text fontSize="lg">Keeper</Text>
            </HStack>
            <Heading
              size="2xl"
              color="text.primary"
              letterSpacing="-0.02em"
              mb={4}
            >
              Organize work with clarity and flow.
            </Heading>
            <Text fontSize="md" color="text.muted" maxW="420px" mb={6}>
              Create boards, track tasks, and collaborate with your team in one
              focused workspace.
            </Text>
            <HStack gap={3} flexWrap="wrap">
              <Box
                bg="bg.panel"
                border="1px solid"
                borderColor="border.muted"
                borderRadius="full"
                px={4}
                py={2}
                fontSize="sm"
                color="text.muted"
              >
                Boards
              </Box>
              <Box
                bg="bg.panel"
                border="1px solid"
                borderColor="border.muted"
                borderRadius="full"
                px={4}
                py={2}
                fontSize="sm"
                color="text.muted"
              >
                Templates
              </Box>
              <Box
                bg="bg.panel"
                border="1px solid"
                borderColor="border.muted"
                borderRadius="full"
                px={4}
                py={2}
                fontSize="sm"
                color="text.muted"
              >
                Team Roles
              </Box>
            </HStack>
            <HStack mt={8} gap={4} flexWrap="wrap">
              <Box
                px={4}
                py={3}
                borderRadius="xl"
                bg="bg.panel"
                border="1px solid"
                borderColor="border.muted"
                boxShadow="0 12px 24px rgba(15, 23, 42, 0.08)"
              >
                <HStack gap={2}>
                  <Box
                    w="32px"
                    h="32px"
                    borderRadius="10px"
                    bg="rgba(31, 134, 220, 0.12)"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    color="blue.600"
                  >
                    <FiZap size={16} />
                  </Box>
                  <Box>
                    <Text fontSize="xs" color="text.muted" fontWeight="600">
                      Speed
                    </Text>
                    <Text fontSize="sm" fontWeight="700" color="text.primary">
                      Fast boards
                    </Text>
                  </Box>
                </HStack>
              </Box>
              <Box
                px={4}
                py={3}
                borderRadius="xl"
                bg="bg.panel"
                border="1px solid"
                borderColor="border.muted"
                boxShadow="0 12px 24px rgba(15, 23, 42, 0.08)"
              >
                <HStack gap={2}>
                  <Box
                    w="32px"
                    h="32px"
                    borderRadius="10px"
                    bg="rgba(124, 58, 237, 0.12)"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    color="purple.600"
                  >
                    <FiLayers size={16} />
                  </Box>
                  <Box>
                    <Text fontSize="xs" color="text.muted" fontWeight="600">
                      Structure
                    </Text>
                    <Text fontSize="sm" fontWeight="700" color="text.primary">
                      Clear flow
                    </Text>
                  </Box>
                </HStack>
              </Box>
              <Box
                px={4}
                py={3}
                borderRadius="xl"
                bg="bg.panel"
                border="1px solid"
                borderColor="border.muted"
                boxShadow="0 12px 24px rgba(15, 23, 42, 0.08)"
              >
                <HStack gap={2}>
                  <Box
                    w="32px"
                    h="32px"
                    borderRadius="10px"
                    bg="rgba(34, 197, 94, 0.12)"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    color="green.600"
                  >
                    <FiTarget size={16} />
                  </Box>
                  <Box>
                    <Text fontSize="xs" color="text.muted" fontWeight="600">
                      Focus
                    </Text>
                    <Text fontSize="sm" fontWeight="700" color="text.primary">
                      Priority first
                    </Text>
                  </Box>
                </HStack>
              </Box>
            </HStack>
          </Box>

          <Box
            bg="bg.panel"
            p={{ base: 6, md: 8 }}
            borderRadius="2xl"
            boxShadow="0 20px 50px rgba(15, 23, 42, 0.12)"
            border="1px solid"
            borderColor="border.muted"
          >
            <Stack gap={6}>
              <Box textAlign="left">
                <Text
                  fontSize="xs"
                  fontWeight="700"
                  color="brand.600"
                  letterSpacing="0.12em"
                  textTransform="uppercase"
                >
                  {isLogin ? "Welcome Back" : "Create Account"}
                </Text>
                <Heading size="lg" color="text.primary" mt={2}>
                  {isLogin ? "Sign in to your workspace" : "Start in seconds"}
                </Heading>
                <Text fontSize="sm" color="text.muted" mt={2}>
                  {isLogin
                    ? "Use your account to continue."
                    : "Create your account to begin."}
                </Text>
              </Box>

              <form onSubmit={handleSubmit}>
                <Stack gap={4}>
                  {!isLogin && (
                    <Field.Root>
                      <Field.Label color="text.primary">Name</Field.Label>
                      <AppInput
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        required={!isLogin}
                      />
                    </Field.Root>
                  )}

                  <Field.Root>
                    <Field.Label color="text.primary">Email</Field.Label>
                    <AppInput
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                    />
                  </Field.Root>

                  <Field.Root>
                    <Field.Label color="text.primary">Password</Field.Label>
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
                    mt={2}
                    loading={isLoginLoading || isRegisterLoading}
                    h="44px"
                  >
                    {isLogin ? "Sign In" : "Sign Up"}
                  </AppButton>
                </Stack>
              </form>

              <HStack justify="center" gap={1} pt={2}>
                <Text fontSize="sm" color="text.muted">
                  {isLogin
                    ? "Don't have an account?"
                    : "Already have an account?"}
                </Text>
                <Text
                  fontSize="sm"
                  color="brand.500"
                  cursor="pointer"
                  fontWeight="500"
                  onClick={() => setIsLogin(!isLogin)}
                  _hover={{ textDecoration: "underline" }}
                >
                  {isLogin ? "Sign up" : "Sign in"}
                </Text>
              </HStack>
            </Stack>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
