---
description: ''
sidebar: 'spec'
next: '/spec/wasm-output/'
prev: '/spec/syntax/'
---

# Semantics

## Elements
The output of the semantic analysis phase is a fully resolved module element.
The logical structure of elements is represented by an abstract syntax, denoted as a context-free grammar.

### Module Element
The module element represents a WebAssembly module and any additional Wrought types or information.

$$
\begin{aligned}
    \nterm{module} &\Coloneqq \nterm{item}^\ast \\ 
    \nterm{item} &\Coloneqq \nterm{import} \mid \nterm{func} \mid \nterm{table} \mid \nterm{mem} \mid \nterm{global} \\ 
    \nterm{item} &\Coloneqq \nterm{struct} \\
\end{aligned}
$$

### Top-Level Elements

### Function-Level Elements

### Element IDs

## Environments

### Environment

### Module Environment

## Name Resolution / Validation

## Type Inference

