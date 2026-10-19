# Masmorra do Algoritmo

Jogo de LeetCode em pixel art. São 10 salas, e cada uma guarda um problema clássico de entrevista. Você escreve a função em JavaScript e ataca: cada teste que passa é um golpe no monstro, cada teste que falha custa um coração.

## Como rodar

É um arquivo só, sem build nem dependências. Abra o `index.html` no navegador ou sirva a pasta:

```bash
python3 -m http.server 8000
```

Dá para publicar direto no GitHub Pages (branch `main`, pasta raiz).

## Salas

| # | Problema | LeetCode | Padrão |
|---|----------|----------|--------|
| 01 | Two Sum | #1 | Hash Map |
| 02 | Contains Duplicate | #217 | Set |
| 03 | Valid Anagram | #242 | Contagem |
| 04 | Valid Palindrome | #125 | Dois Ponteiros |
| 05 | Valid Parentheses | #20 | Pilha |
| 06 | Binary Search | #704 | Busca Binária |
| 07 | Best Time to Buy and Sell Stock | #121 | Greedy |
| 08 | Climbing Stairs | #70 | Prog. Dinâmica |
| 09 | Maximum Subarray | #53 | Kadane |
| 10 | Longest Substring Without Repeating Characters | #3 | Janela Deslizante (chefe) |

## Regras

- **3 ★**: limpar a sala sem dicas e sem levar dano.
- **Pergaminho**: mostra uma dica e custa 1 ★.
- **Teste de resistência**: entradas grandes (100 mil itens) reprovam soluções O(n²).
- **Modo guiado**: resolver o exemplo à mão → escrever o plano em português → colar o plano como comentários no editor.

## Como funciona

- O código do jogador roda num Web Worker com timeout, então laço infinito não trava a página.
- O progresso e o código de cada sala ficam no `localStorage` (chave `masmorra-v1`).
- Os sprites são matrizes de caracteres desenhadas num `<canvas>`.
- Para adicionar uma sala, inclua um objeto em `LEVELS` e o passo a passo correspondente em `GUIDE`.
