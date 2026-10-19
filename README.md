# Masmorra do Algoritmo

Jogo de LeetCode em pixel art. São **64 salas em 10 andares**: cada andar treina um padrão de entrevista e termina num chefe. Você escreve a função em JavaScript e ataca: cada teste que passa é um golpe no monstro, cada teste que falha custa um coração.

## Como rodar

Não tem build nem dependências. Sirva a pasta com qualquer servidor estático:

```bash
python3 -m http.server 8000
```

e abra `http://localhost:8000`. Para publicar, use o GitHub Pages (branch `main`, pasta raiz).

## Regras

- **3 ★**: limpar a sala sem dicas e sem levar dano.
- **Pergaminho**: mostra uma dica e custa 1 ★.
- **Teste de resistência**: entradas grandes reprovam a solução ingênua (O(n²), recursão sem memória).
- **Modo guiado**: resolver o exemplo à mão, escrever o plano em português e colar o plano como comentários no editor.
- **Andar 1** é o treino: vencer o chefe dele abre todos os outros andares. Dentro de cada andar, as salas abrem em ordem.

## Andares

### Andar 1 · O Saguão (Fundamentos)

- #1 Two Sum · Easy
- #217 Contains Duplicate · Easy
- #242 Valid Anagram · Easy
- #125 Valid Palindrome · Easy
- #20 Valid Parentheses · Easy
- #704 Binary Search · Easy
- #121 Best Time to Buy and Sell Stock · Easy
- #70 Climbing Stairs · Easy
- #53 Maximum Subarray · Medium
- **Chefe:** #3 Longest Substring Without Repeating Characters · Medium

### Andar 2 · A Biblioteca Proibida (Arrays & Hashing)

- #49 Group Anagrams · Medium
- #347 Top K Frequent Elements · Medium
- #238 Product of Array Except Self · Medium
- #36 Valid Sudoku · Medium
- **Chefe:** #128 Longest Consecutive Sequence · Medium

### Andar 3 · As Minas Gêmeas (Dois Ponteiros & Janela Deslizante)

- #167 Two Sum II - Input Array Is Sorted · Medium
- #15 3Sum · Medium
- #11 Container With Most Water · Medium
- #424 Longest Repeating Character Replacement · Medium
- **Chefe:** #76 Minimum Window Substring · Hard

### Andar 4 · A Torre do Eco (Pilha & Busca Binária)

- #150 Evaluate Reverse Polish Notation · Medium
- #739 Daily Temperatures · Medium
- #153 Find Minimum in Rotated Sorted Array · Medium
- #33 Search in Rotated Sorted Array · Medium
- **Chefe:** #84 Largest Rectangle in Histogram · Hard

### Andar 5 · As Correntes (Linked List)

- #206 Reverse Linked List · Easy
- #21 Merge Two Sorted Lists · Easy
- #141 Linked List Cycle · Easy
- #19 Remove Nth Node From End of List · Medium
- #2 Add Two Numbers · Medium
- **Chefe:** #23 Merge k Sorted Lists · Hard

### Andar 6 · O Bosque Invertido (Árvores)

- #226 Invert Binary Tree · Easy
- #104 Maximum Depth of Binary Tree · Easy
- #100 Same Tree · Easy
- #102 Binary Tree Level Order Traversal · Medium
- #98 Validate Binary Search Tree · Medium
- #235 Lowest Common Ancestor of a Binary Search Tree · Medium
- #230 Kth Smallest Element in a BST · Medium
- **Chefe:** #124 Binary Tree Maximum Path Sum · Hard

### Andar 7 · O Poço dos Ecos (Heap & Backtracking)

- #215 Kth Largest Element in an Array · Medium
- #1046 Last Stone Weight · Easy
- #78 Subsets · Medium
- #46 Permutations · Medium
- #39 Combination Sum · Medium
- **Chefe:** #79 Word Search · Medium

### Andar 8 · As Cavernas Conectadas (Grafos)

- #200 Number of Islands · Medium
- #695 Max Area of Island · Medium
- #994 Rotting Oranges · Medium
- #207 Course Schedule · Medium
- **Chefe:** #127 Word Ladder · Hard

### Andar 9 · A Cripta da Memória (Programação Dinâmica)

- #198 House Robber · Medium
- #213 House Robber II · Medium
- #322 Coin Change · Medium
- #300 Longest Increasing Subsequence · Medium
- #62 Unique Paths · Medium
- #139 Word Break · Medium
- #1143 Longest Common Subsequence · Medium
- **Chefe:** #72 Edit Distance · Medium

### Andar 10 · O Salão dos Intervalos (Intervalos & Greedy)

- #55 Jump Game · Medium
- #56 Merge Intervals · Medium
- #57 Insert Interval · Medium
- #435 Non-overlapping Intervals · Medium
- #134 Gas Station · Medium
- **Chefe:** #45 Jump Game II · Medium

## Estrutura

```
index.html        motor do jogo: mapa, combate, editor, cena em canvas, sprites
js/runtime.js     runtime compartilhado: ListNode/TreeNode, conversão dos testes e comparação
levels/           um arquivo por andar (addFloor) + README com o formato das salas
tools/check.mjs   validador dos andares
```

- O código do jogador roda num Web Worker com timeout de 2,5 s, então laço infinito não trava a página.
- `ListNode(val, next)` e `TreeNode(val, left, right)` existem no editor, como no LeetCode. Listas e árvores aparecem nos testes como arrays (árvores em ordem por nível).
- O progresso e o código de cada sala ficam no `localStorage` (chave `masmorra-v1`).

## Adicionar ou mudar salas

O formato está em [levels/README.md](levels/README.md). Depois de editar, rode:

```bash
node tools/check.mjs
```

O validador roda a solução de referência e o código montado do modo guiado contra todos os testes, usando o mesmo runtime do jogo, e garante que o código inicial vazio falha. Precisa de Node 18 ou mais novo.
