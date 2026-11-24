# Regras de gamificação, retenção e comunidade

**Estado:** planejamento. Este documento define as regras de produto aprovadas até aqui; ele não autoriza implementação automática.

## 1. Princípios

- A plataforma incentiva constância, revisão e aprendizado completo, e não apenas rapidez.
- Competição deve ser leve e divertida. Nenhuma interação entre alunos remove XP, altera respostas, bloqueia conteúdo ou atrasa o progresso de outra pessoa.
- Uma revisão faz parte da lição: o aluno recebe a recompensa completa quando conclui a lição e as revisões exigidas naquele momento.
- Como o público inclui crianças, a comunidade usa apelidos e interações predefinidas. Não haverá chat, mensagens livres, e-mail visível, nome real, idade ou escola expostos.
- O perfil é social por padrão: não haverá modo privado. O apelido deve ser único, adequado e sujeito à moderação.

## 2. Perfil do aluno

Cada aluno terá:

- apelido público;
- avatar personalizável;
- nível atual e XP total;
- sequência de dias estudados;
- conquistas e missões;
- lista de pessoas seguidas e de seguidores;
- posição nas ligas e nos rankings aplicáveis.

O avatar começa com opções básicas de cor de pele, olhos, boca e roupa. Itens adicionais são somente cosméticos e podem ser obtidos por missões, conquistas, temporadas ou eventos futuros. Eles não concedem XP, vantagem de tempo nem acesso pedagógico.

## 3. XP, lições e níveis

### 3.1 Valor por bloco

Cada bloco usa um XP base por lição completa. O valor aumenta 5 XP a cada bloco:

```text
XP base do bloco = 20 + 5 × (número do bloco - 1)
XP sem revisão = arredondar(XP base × 0,75)
Bônus on fire = arredondar(XP base × 0,10)
```

Exemplos:

| Bloco | XP completo | Sem revisão | Bônus on fire |
|---:|---:|---:|---:|
| 1 | 20 | 15 | 2 |
| 2 | 25 | 19 | 3 |
| 3 | 30 | 23 | 3 |
| 4 | 35 | 26 | 4 |

Uma lição completa inclui a lição nova e as revisões exigidas na sessão. Caso o aluno conclua só a parte nova, recebe 75% do XP base, arredondado.

### 3.2 Sequência e estado on fire

- A sequência conta dias consecutivos em que o aluno realiza uma atividade de estudo válida.
- O estado **on fire** é ativado no terceiro dia consecutivo.
- No bloco 1, quem inicia uma sequência no próprio bloco recebe bônus nos últimos 10 dias/lições da simulação de 12 lições.
- Se o aluno já chega on fire a um novo bloco, o bônus se aplica desde a primeira lição desse bloco.
- O bônus é somado somente à lição completa. Fazer uma lição sem as revisões não recebe bônus on fire.
- O bônus de sequência não é perdido nem concedido por animações, rankings ou ações sociais.

> **Pendente de definição antes da implementação:** estabelecer se revisões feitas sem lição nova preservam a sequência. A recomendação é que preservem a sequência, mas não gerem XP on fire nem substituam a lição completa do dia.

### 3.3 Meta de nível

O nível corresponde ao bloco em que o aluno se encontra. Para subir, o aluno precisa cumprir as lições do bloco e atingir a meta de XP acumulado daquele nível.

A meta por bloco será a média entre:

1. o XP de quem completa todas as lições e revisões sem bônus de constância; e
2. o XP de quem completa todas as lições e revisões com o bônus on fire esperado.

```text
Meta do bloco = arredondar((XP regular completo + XP frequente completo) ÷ 2)
Meta acumulada = soma das metas dos blocos concluídos
```

### 3.4 Tabela de referência fornecida

A tabela abaixo reproduz a simulação de 12 lições por bloco. Para o bloco 1, o aluno frequente ativa on fire após as duas primeiras lições; a partir do bloco 2, essa simulação considera que ele manteve o estado on fire entre os blocos.

| Bloco | XP completo | XP sem revisão | Bônus | Frequente completo | Regular completo | Frequente sem revisão | Irregular sem revisão | Meta do bloco | Meta acumulada |
|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 1 | 20 | 15 | 2 | 260 | 240 | 200 | 180 | 250 | 250 |
| 2 | 25 | 19 | 3 | 336 | 300 | 336 | 228 | 318 | 568 |
| 3 | 30 | 23 | 3 | 396 | 360 | 396 | 276 | 378 | 946 |
| 4 | 35 | 26 | 4 | 468 | 420 | 468 | 312 | 444 | 1.390 |
| 5 | 40 | 30 | 4 | 528 | 480 | 528 | 360 | 504 | 1.894 |
| 6 | 45 | 34 | 5 | 600 | 540 | 600 | 408 | 570 | 2.464 |
| 7 | 50 | 38 | 5 | 660 | 600 | 660 | 456 | 630 | 3.094 |
| 8 | 55 | 41 | 6 | 732 | 660 | 732 | 492 | 696 | 3.790 |
| 9 | 60 | 45 | 6 | 792 | 720 | 792 | 540 | 756 | 4.546 |
| 10 | 65 | 49 | 7 | 864 | 780 | 864 | 588 | 822 | 5.368 |

Os campos “frequente sem revisão” e “irregular sem revisão” permanecem como cenários de acompanhamento. A meta de nível usa os cenários completos, pois o objetivo do sistema é valorizar a revisão.

> **Inconsistência a confirmar:** a regra de 75% para uma lição sem revisão indica, por exemplo, `19 × 12 + 3 × 12 = 264 XP` para um aluno on fire sem revisão no bloco 2. A tabela fornecida mostra 336 nessa coluna, que é o mesmo valor da lição completa com bônus. Antes de implementar, é preciso decidir se a tabela representa uma exceção intencional ou se a coluna/fórmula deve ser corrigida.

> **Pendente de definição antes da implementação:** confirmar se banco de frases, fechamento e prova contam como lições de XP e se todos os blocos terão exatamente 12 unidades pontuáveis. Caso a resposta seja não, a tabela deverá calcular a quantidade real de unidades de cada bloco, sem alterar a fórmula.

## 4. Rankings e ligas

Os rankings servem para reconhecimento e celebração. Eles não mudam conteúdo desbloqueado, notas, XP ou o progresso de terceiros.

### 4.1 Ligas pequenas

- Cada aluno pertence a uma liga de até 15 pessoas.
- As ligas priorizam participantes em faixa de nível e atividade semelhantes.
- A classificação é reiniciada a cada temporada, em duração a definir.
- A tela da liga mostra apelido, avatar, posição, métrica da liga e animações de celebração.

### 4.2 Rankings

| Ranking | Métrica | Regra de entrada |
|---|---|---|
| Geral | XP obtido na temporada | aluno ativo na temporada |
| Consistência | maior sequência atual e marcos conquistados | ao menos um dia de estudo válido |
| Velocidade | menor tempo médio por bloco concluído | preencher a resposta opcional de tradução em todas as questões elegíveis; tentativas incompletas não entram |
| Pontuação / nível | nível e XP acumulado | aluno com ao menos uma lição concluída |
| Revisão | proporção de lições concluídas com revisão | quantidade mínima de lições, a definir |
| Missões | missões diárias e semanais concluídas | aluno ativo na temporada |

O ranking de velocidade deve excluir tempos anormalmente baixos, sessões interrompidas e dados incompletos. Ele mede tempo de estudo válido, não rapidez de clique.

## 5. Interações sociais permitidas

Um aluno pode seguir outro. Entre pessoas que se seguem, as únicas interações são predefinidas:

- enviar incentivo;
- parabenizar uma conquista, nível, missão ou sequência;
- desafiar para uma missão disponível na plataforma.

Não haverá mensagens escritas, anexos, pedidos de contato externo ou interações que permitam assédio. Desafios usam modelos definidos pelo sistema e aceitação explícita do convidado.

## 6. Corrida e celebrações cosméticas

Ao ultrapassar alguém em uma liga ou ranking, o sistema pode mostrar uma animação curta de corrida. Cada aluno escolhe sua comemoração equipada.

Itens iniciais:

- **Turbo:** o avatar acelera e ultrapassa o colega.
- **Banana:** o avatar arremessa uma banana; o outro carrinho desliza apenas na animação.
- **Bola de neve:** o avatar lança uma bola de neve; o outro fica atordoado apenas visualmente.

As animações não reduzem XP, não mudam a posição real além da ultrapassagem já causada pelos pontos, não interferem no estudo e não são exibidas de forma repetitiva ou invasiva. Novas comemorações são recompensas cosméticas futuras.

## 7. Caminho visual e missões

O curso terá um mapa visual. Cada bloco é uma região e cada lição é um ponto do caminho. O mapa mostra lições concluídas, próximas etapas, revisões pendentes, banco de frases, fechamento e prova.

### Missões diárias

Exemplos:

- concluir uma lição com revisão;
- revisar frases vencidas;
- ouvir determinado número de áudios;
- responder determinado número de frases;
- manter a sequência do dia.

### Missões semanais

Exemplos:

- estudar em três dias diferentes;
- concluir um ciclo de lições;
- atingir uma taxa de revisão definida;
- concluir uma prova de bloco;
- ajudar a si mesmo a retomar após uma pausa.

Missões concedem XP, itens cosméticos, progresso de conquistas ou moedas cosméticas futuras. Elas não podem exigir interação social para serem concluídas.

## 8. Conquistas

### Marcos de consistência visíveis

- 1 dia;
- 2 dias seguidos;
- 3 dias seguidos;
- 1 semana;
- 2 semanas;
- 3 semanas;
- 1 mês;
- 2 meses e marcos posteriores.

### Conquistas secretas

Exemplos iniciais:

- **Ouvido atento:** concluir desafios de escuta definidos;
- **Revisor cuidadoso:** atingir uma taxa alta de lições completas com revisão;
- **Volta por cima:** retornar e concluir uma sessão após uma pausa;
- **Explorador:** concluir um banco de frases;
- **Chegada ao fim:** concluir o fechamento de um bloco;
- **Primeira ultrapassagem:** ultrapassar alguém em uma liga por mérito de XP;
- **Fogo constante:** manter on fire por um período definido.

Conquistas secretas podem revelar somente o título e a recompensa após serem conquistadas. Os critérios não devem depender de sorte, gastos ou de prejudicar outro aluno.

## 9. Marcos sociais

O sistema pode gerar notificações predefinidas como:

- “Você ultrapassou [apelido] na sua liga.”
- “[Apelido] alcançou seu nível.”
- “Você conquistou uma nova sequência de estudo.”
- “[Apelido] completou uma missão.”

As notificações devem permitir desativar apenas alertas visuais/sonoros, sem ocultar o perfil ou retirar o aluno do ambiente social.

## 10. Itens que precisam ser definidos antes de implementar

1. Duração da temporada e critérios de troca de liga.
2. Se revisões isoladas preservam a sequência.
3. Quantidade real de unidades que geram XP em cada bloco.
4. Confirmar a fórmula dos cenários “sem revisão” a partir do bloco 2.
5. XP e papel pedagógico de banco de frases, fechamento e prova.
6. Recompensa exata de missões e conquistas.
7. Regras de criação, alteração e moderação de apelidos.
8. Critérios de tempo válido e mínimo de participação para o ranking de velocidade.
9. Critérios de segurança, denúncia e bloqueio de seguidores.
