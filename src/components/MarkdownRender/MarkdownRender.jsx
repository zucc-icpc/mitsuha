/* eslint-disable react/display-name */
import * as React from "react";
import * as ReactMarkdown from "react-markdown";
import MathJax from "@matejmazur/react-mathjax";
import RemarkMathPlugin from "remark-math";

export const MarkdownRender = (props) => {
  const newProps = {
    ...props,
    plugins: [
      RemarkMathPlugin,
    ],
    renderers: {
      ...props.renderers,
      math: (props) => <MathJax.Node>{props.value}</MathJax.Node>,
      inlineMath: (props) => <MathJax.Node inline>{props.value}</MathJax.Node>,
    }
  };
  return (
    <MathJax.Context input="tex">
      <ReactMarkdown {...newProps} />
    </MathJax.Context>
  );
};