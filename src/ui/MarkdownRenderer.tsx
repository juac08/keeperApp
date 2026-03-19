import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Box, Text, Heading, Code } from "@chakra-ui/react";

type Props = {
  content: string;
};

const MarkdownRenderer: React.FC<Props> = ({ content }) => {
  return (
    <Box
      className="markdown-body"
      css={{
        "& p": {
          marginBottom: "0.75em",
          lineHeight: 1.7,
          fontSize: "0.875rem",
        },
        "& p:last-child": {
          marginBottom: 0,
        },
        "& h1": {
          fontSize: "1.5rem",
          fontWeight: 700,
          marginBottom: "0.75em",
          marginTop: "1em",
          lineHeight: 1.3,
        },
        "& h2": {
          fontSize: "1.25rem",
          fontWeight: 700,
          marginBottom: "0.5em",
          marginTop: "0.75em",
          lineHeight: 1.3,
        },
        "& h3": {
          fontSize: "1.1rem",
          fontWeight: 600,
          marginBottom: "0.5em",
          marginTop: "0.75em",
          lineHeight: 1.3,
        },
        "& ul, & ol": {
          paddingLeft: "1.5em",
          marginBottom: "0.75em",
          fontSize: "0.875rem",
        },
        "& li": {
          marginBottom: "0.25em",
          lineHeight: 1.6,
        },
        "& li > ul, & li > ol": {
          marginTop: "0.25em",
          marginBottom: 0,
        },
        "& code": {
          fontSize: "0.8em",
          padding: "0.15em 0.4em",
          borderRadius: "4px",
          fontFamily: "'SF Mono', 'Fira Code', monospace",
        },
        "& pre": {
          borderRadius: "8px",
          padding: "0.75em 1em",
          marginBottom: "0.75em",
          overflowX: "auto",
          fontSize: "0.825rem",
          lineHeight: 1.5,
        },
        "& pre code": {
          padding: 0,
          borderRadius: 0,
          background: "transparent",
        },
        "& blockquote": {
          borderLeft: "3px solid",
          borderColor: "var(--chakra-colors-blue-400)",
          paddingLeft: "1em",
          marginBottom: "0.75em",
          fontStyle: "italic",
          opacity: 0.85,
        },
        "& a": {
          color: "var(--chakra-colors-blue-400)",
          textDecoration: "underline",
        },
        "& a:hover": {
          color: "var(--chakra-colors-blue-500)",
        },
        "& hr": {
          marginTop: "1em",
          marginBottom: "1em",
          opacity: 0.2,
        },
        "& table": {
          width: "100%",
          borderCollapse: "collapse",
          marginBottom: "0.75em",
          fontSize: "0.825rem",
        },
        "& th, & td": {
          padding: "0.5em 0.75em",
          textAlign: "left",
        },
        "& th": {
          fontWeight: 600,
        },
        "& img": {
          maxWidth: "100%",
          borderRadius: "8px",
        },
        "& input[type='checkbox']": {
          marginRight: "0.5em",
        },
      }}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <Heading as="h1" size="xl" color="text.primary">
              {children}
            </Heading>
          ),
          h2: ({ children }) => (
            <Heading as="h2" size="lg" color="text.primary">
              {children}
            </Heading>
          ),
          h3: ({ children }) => (
            <Heading as="h3" size="md" color="text.primary">
              {children}
            </Heading>
          ),
          p: ({ children }) => (
            <Text color="text.secondary" lineHeight="1.7" fontSize="sm">
              {children}
            </Text>
          ),
          li: ({ children }) => (
            <li>
              <Text as="span" color="text.secondary">
                {children}
              </Text>
            </li>
          ),
          code: ({ className, children, ...props }) => {
            const isInline = !className;
            if (isInline) {
              return (
                <Code
                  fontSize="0.8em"
                  px="0.4em"
                  py="0.1em"
                  borderRadius="4px"
                  bg="bg.muted"
                  color="text.primary"
                >
                  {children}
                </Code>
              );
            }
            return (
              <Box
                as="pre"
                bg="bg.muted"
                borderRadius="lg"
                p={4}
                overflowX="auto"
                mb={3}
                border="1px solid"
                borderColor="border.muted"
              >
                <Code
                  display="block"
                  whiteSpace="pre"
                  bg="transparent"
                  color="text.primary"
                  fontSize="0.825rem"
                  className={className}
                >
                  {children}
                </Code>
              </Box>
            );
          },
          blockquote: ({ children }) => (
            <Box
              borderLeft="3px solid"
              borderColor="blue.400"
              pl={4}
              mb={3}
              opacity={0.85}
            >
              {children}
            </Box>
          ),
          a: ({ children, href }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "var(--chakra-colors-blue-400, #60a5fa)",
                textDecoration: "underline",
              }}
            >
              {children}
            </a>
          ),
          table: ({ children }) => (
            <Box
              as="table"
              w="100%"
              mb={3}
              borderRadius="lg"
              overflow="hidden"
              border="1px solid"
              borderColor="border.muted"
            >
              {children}
            </Box>
          ),
          th: ({ children }) => (
            <Box
              as="th"
              bg="bg.muted"
              p={2}
              fontSize="xs"
              fontWeight="700"
              color="text.primary"
              textAlign="left"
              borderBottom="1px solid"
              borderColor="border.muted"
            >
              {children}
            </Box>
          ),
          td: ({ children }) => (
            <Box
              as="td"
              p={2}
              fontSize="sm"
              color="text.secondary"
              borderBottom="1px solid"
              borderColor="border.muted"
            >
              {children}
            </Box>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </Box>
  );
};

export default MarkdownRenderer;
