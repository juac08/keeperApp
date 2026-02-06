import React, { useState } from "react";
import { Box, Stack, Text, Field, HStack, Heading } from "@chakra-ui/react";
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
        appToaster.success({ title: "Login successful!" });
      } else {
        await register({ email, password, name }).unwrap();
        appToaster.success({ title: "Account created successfully!" });
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
        bgGradient="radial(circle at 10% 10%, rgba(31, 134, 220, 0.2), transparent 45%), radial(circle at 90% 20%, rgba(114, 187, 255, 0.18), transparent 40%), radial(circle at 50% 90%, rgba(31, 134, 220, 0.16), transparent 45%)"
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
      />
      <Box
        position="absolute"
        bottom="-140px"
        left="-80px"
        w="260px"
        h="260px"
        borderRadius="full"
        bg="rgba(114, 187, 255, 0.14)"
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
              {isLogin ? "Don't have an account?" : "Already have an account?"}
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
