import React, { useState } from "react";
import { Box, Stack, Text, Field, HStack } from "@chakra-ui/react";
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
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="bg.muted"
    >
      <Box
        bg="bg.panel"
        p={8}
        borderRadius="lg"
        boxShadow="lg"
        w="full"
        maxW="400px"
      >
        <Stack gap={6}>
          <Box textAlign="center">
            <Text fontSize="2xl" fontWeight="bold" color="text.primary">
              {isLogin ? "Welcome Back" : "Create Account"}
            </Text>
            <Text fontSize="sm" color="text.muted" mt={2}>
              {isLogin ? "Sign in to continue" : "Sign up to get started"}
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
              >
                {isLogin ? "Sign In" : "Sign Up"}
              </AppButton>
            </Stack>
          </form>

          <HStack justify="center" gap={1}>
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
  );
};
