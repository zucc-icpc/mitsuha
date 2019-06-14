/* eslint-disable react/display-name */
import * as React from "react";
import * as ReactMarkdown from "react-markdown";
import MathJax from "@matejmazur/react-mathjax";
const RemarkMathPlugin = require("remark-math");

export const MarkdownRender = (props) => {
  console.log(props)
  const newProps = {
    ...props,
    plugins: [
      RemarkMathPlugin,
    ],
    renderers: {
      ...props.renderers,
      math: (props) => <MathJax.Node>{props.source}</MathJax.Node>,
      inlineMath: (props) => <MathJax.Node inline>{props.source}</MathJax.Node>,
    }
  };
  return (
    <MathJax.Context input="tex">
      <ReactMarkdown {...newProps} />
    </MathJax.Context>
  );
};