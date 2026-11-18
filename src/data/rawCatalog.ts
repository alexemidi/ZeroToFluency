import { RawWordCatalogItem, RawPhraseCatalogItem } from '../types';

/**
 * Texto integral das 1000 palavras enviadas pelo professor (para busca, catálogo e geração de novos dias).
 */
const RAW_WORDS_TEXT = `
1. The — O / A / Os / As
2. Of — De
3. To — Para / A
4. And — E
5. A — Um / Uma
6. In — Em / No / Na
7. Is — É / Está
8. It — Isso / Ele / Ela
9. You — Você / Vocês
10. That — Que / Aquele(a) / Isso / Aquilo
11. He — Ele
12. Was — Era / Estava / Foi
13. For — Para / Por
14. On — Em / No / Na / Sobre
15. Are — São / Estão
16. With — Com
17. As — Como / Conforme
18. I — Eu
19. His — Dele, seu
20. They — Eles / Elas
21. Be — Ser / Estar
22. At — Em / No / Na (lugar)
23. One — Um / Uma
24. Have — Ter, haver
25. This — Este / Esta / Isto
26. From — De / A partir de
27. Or — Ou
28. Had — Tinha / Teve
29. By — Por / De
30. But — Mas / Porém
31. Yes — Sim
32. What — O quê / Qual
33. Some — Algum / Alguma /Alguns
34. We — Nós
35. Can — Poder / Conseguir
36. Out — Fora / Para fora
37. Other — Outro / Outra
38. Were — Eram / Estavam
39. All — Todo / Todos / Tudo
40. There — Lá / Ali
41. When — Quando
42. Up — Para cima / Acima
43. Use — Usar
44. Your — Seu / Sua / Seus / Suas
45. How — Como / Quão
46. Said — Disse / Falou
47. An — Um / Uma (antes de vogal)
48. Each — Cada
49. She — Ela
50. Which — Qual / O qual
51. Do — Fazer
52. Their — Dele / Deles / Delas
53. Time — Tempo / Hora
54. If — Se
55. Will — Vai / Irá (futuro) / quer
56. Way — Caminho / Modo
57. About — Sobre / Cerca de
58. Many — Muitos / Muitas
59. Then — Então / Depois
60. Them — Eles / Elas (objeto)
61. Write — Escrever
62. Would — Iria / gostaria
63. Like — Como / Gostar
64. So — Tão / Então
65. These — Estes / Estas
66. Her — Dela / A ela
67. Long — Longo / Comprido
68. Make — Fazer / Criar
69. Thing — Coisa
70. See — Ver
71. Him — Ele (objeto)
72. Two — Dois / Duas
73. Has — Tem
74. Look — Olhar
75. More — Mais
76. Day — Dia
77. Could — Podia / Poderia
78. Go — Ir
79. Come — Vir / Chegar
80. Did — Fez, fazia
81. Because — Porque
82. No — Não / Nenhum / Sem
83. Most — A maioria / Mais
84. People — Pessoas / Povo
85. My — Meu / Minha / Meus / Minhas
86. Over — Sobre / Acima
87. Know — Saber / Conhecer
88. Water — Água
89. Than — Do que
90. Call — Chamar / Ligar
91. First — Primeiro / Primeira
92. Who — Quem
93. May — Poder (talvez)
94. Down — Para baixo / Abaixo
95. Side — Lado
96. Been — Sido / Estado
97. Now — Agora
98. Find — Encontrar / Achar
99. Any — Qualquer / Algum
100. New — Novo / Nova
101. Work — Trabalho / Trabalhar
102. Part — Parte / Peça
103. Take — Pegar / Tomar / Levar
104. Get — Conseguir / Obter / Pegar
105. Place — Lugar / Local
106. Made — Feito / Produzido (passado de make)
107. Live — Viver / Morar
108. Where — Onde / Onde quer que
109. After — Depois / Após
110. Back — Costas / De volta / Atrás
111. Little — Pequeno / Pouco
112. Only — Apenas / Somente / Único
113. Everything — Tudo / Cada coisa
114. Man — Homem
115. Year — Ano
116. Came — Veio (passado de come)
117. Show — Mostrar / Exibir
118. Every — Cada / Todo
119. Good — Bom / Boa
120. Me — Mim / Me
121. Give — Dar / Oferecer
122. Our — Nosso / nossos / nossa / nossas
123. Under — Sob / Embaixo de
124. Name — Nome / Denominar
125. Very — Muito
126. Through — Através / Por meio de
127. Despite — Apesar de
128. Besides — Além de / Além disso
129. Beyond — Além de / Para além de
130. Just — Apenas / Justo / Acabado de
131. Probably — Provavelmente
132. However — No entanto / Contudo
133. Great — Ótimo / Grande / Excelente
134. Think — Pensar / Achar
135. Say — Dizer / Falar
136. Help — Ajudar / Socorro
137. Low — Baixo / Baixa
138. Important — Importante
139. Line — Linha / Fila
140. Different — Diferente
141. Turn — Virar / Voltar / Vez
142. Cause — Causar / Motivo / Razão
143. Much — Muito / Muita
144. Mean — Significar / Malvado / Intenção
145. Before — Antes / Perante
146. Move — Mover
147. Right — Certo / Direita
148. Boy — Menino / Garoto
149. Old — Velho / Antigo
150. Too — Também
151. Same — Mesmo / Igual
152. Tell — Contar / Dizer
153. Does — Faz (3ª pessoa de Do)
154. Set — Pôr / Ajustar / Estabelecer
155. Three — Três
156. Want — Querer / Desejar
157. Well — Bem / Poço
158. Also — Também / Além disso
159. Play — Jogar / Brincar / Tocar (instrumento)
160. Small — Pequeno / Reduzido
161. End — Fim
162. Put — Colocar / Pôr
163. Home — Casa / Lar
164. Read — Ler / Lido
165. Hand — Mão / Entregar
166. Doubt — Dúvida / Duvidar
167. Large — Grande / Amplo
168. Add — Adicionar / Somar
169. Even — Até / Mesmo / Par (número)
170. Here — Aqui / Cá
171. Must — Dever / Ter que (obrigação)
172. Big — Grande / Enorme
173. High — Alto / Elevado
174. Such — Tal / Tais / Semelhante
175. Follow — Seguir / Acompanhar
176. Act — Agir / Ato / Ação
177. Why — Por quê?
178. Ask — Perguntar / Pedir
179. Men — Homens (plural de man)
180. Change — Mudar / Trocar / Troco
181. Went — Foi / Foram (passado de Go)
182. Light — Luz / Claro / Leve
183. Kind — Tipo / Espécie / Gentil
184. Off — Desligado / Fora / Longe
185. Need — Precisar / Necessidade
186. House — Casa / Residência
187. Picture — Imagem / Foto / Quadro
188. Try — Tentar / Experimentar
189. Us — Nós (como objeto)
190. Become — Tornar-se / Vir a ser
191. Again — Novamente / Outra vez
192. Purpose — Propósito / Finalidade
193. Animal — Animal
194. Point — Ponto / Apontar
195. Mother — Mãe
196. World — Mundo / Terra
197. Near — Perto / Próximo
198. Build — Construir / Edificar
199. Self — Próprio / Eu (reflexivo)
200. Actually — Na verdade / Realmente
201. Although — Embora / Apesar de que
202. Father — Pai
203. Head — Cabeça / Liderar
204. Stand — Ficar de pé / Suportar / Barraca
205. Own — Próprio / Possuir
206. Health — Saúde
207. Should — Deveria (conselho)
208. Country — País / Campo
209. Found — Encontrou / Fundar (passado de find)
210. Answer — Responder / Resposta
211. School — Escola / Colégio
212. Grow — Crescer / Cultivar
213. Study — Estudar / Estudo
214. Still — Ainda / Contudo / Calmo
215. Learn — Aprender
216. Beside — Ao lado de / Perto
217. Inside — Dentro / Parte interna
218. Outside — Fora / Parte externa
219. Plant — Planta / Plantar / Fábrica
220. Cover — Cobrir / Capa / Tampa
221. Food — Comida / Alimento
222. Sun — Sol
223. Four — Quatro
224. Between — Entre (dois)
225. State — Estado / Declarar / Situação
226. Keep — Manter / Guardar / Continuar
227. Eye — Olho
228. Never — Nunca / Jamais
229. Last — Último / Durar / Passado
230. Let — Deixar / Permitir
231. Thought — Pensamento / Achou (passado de think)
232. City — Cidade / Município
233. Action — Ação / Ato
234. Tree — Árvore
235. Cross — Cruzar / Cruz
236. Hi — Oi / Olá
237. Hard — Difícil / Duro / Com força
238. Start — Começar / Início
239. Might — Poderia (possibilidade) / Força
240. Story — História / Conto
241. Saw — Viu / Serra (passado de see)
242. Far — Longe / Distante
243. Sea — Mar
244. Draw — Desenhar
245. Left — Esquerda / Deixado (passado de Leave)
246. Late — Tarde / Atrasado
247. Run — Correr / Executar
248. Don't — Não (forma contraída de do not)
249. While — Enquanto / Espaço de tempo
250. Press — Pressionar / Imprensa
251. Close — Fechar / Perto / Próximo
252. Night — Noite
253. Real — Real / Verdadeiro
254. Life — Vida
255. Few — Poucos / Algumas
256. Explain — Explicar
257. North — Norte
258. Open — Abrir / Aberto
259. Seem — Parecer / Aparentar
260. Together — Juntos / Em conjunto
261. Next — Próximo / Seguinte
262. White — Branco / Branca
263. Children — Crianças (plural de Child)
264. Begin — Começar / Iniciar
265. Got — Consegui (passado de Get)
266. Walk — Caminhar / Andar / Passeio
267. Example — Exemplo / Modelo
268. Easy — Fácil / Tranquilo
269. Group — Grupo / Agrupamento
270. Always — Sempre
271. Music — Música
272. Those — Aqueles / Aquelas
273. Both — Ambos / Os dois
274. Mark — Marcar / Marca / Nota
275. Often — Frequentemente / Muitas vezes
276. Until — Até (momento)
277. River — Rio
278. Car — Carro / Automóvel
279. Feet — Pés (plural de foot)
280. Care — Cuidar / Cuidado / Atenção
281. Second — Segundo (tempo ou ordem)
282. Book — Livro / Reservar
283. Carry — Carregar / Transportar
284. Took — Levou / Pegou (passado de Take)
285. Science — Ciência
286. Eat — Comer
287. Room — Quarto / Sala / Espaço
288. Friend — Amigo / Amiga
289. Began — Começou (passado de begin)
290. Idea — Ideia / Opinião
291. Stop — Parar / Parada
292. Once — Uma vez / Certa vez / Outrora
293. Base — Base / Fundamento
294. Hear — Ouvir
295. Cut — Cortar / Corte
296. Sure — Certo / Seguro / Com certeza
297. Watch — Assistir / Observar / Relógio
298. Color — Cor / Colorir
299. Face — Rosto / Face
300. Main — Principal / Principalmente
420. Week — Semana
431. Today — Hoje
432. Yesterday — Ontem
433. Tomorrow — Amanhã
466. Ran — Correu (passado de Run)
472. Brought — Trouxe (passado de Bring)
474. Bring — Trazer / Levar
487. Am — Sou / Estou
520. Bed — Cama / Leito
521. Brother — Irmão
522. Egg — Ovo
523. Coffee — Café
544. Sat — Sentou (passado de sit)
548. Kept — Mantido / Guardado (passado de keep)
563. Happy — Feliz / Alegre
564. Sad — Triste / Melancólico
573. Baby — Bebê
578. Buy — Comprar
623. Broke — Quebrou / Quebrado (passado de break)
682. Wrote — Escreveu (passado de write)
688. Break — Quebrar / Pausa / Intervalo
697. Grew — Cresceu (passado de grow)
708. Sent — Enviado (passado de Send)
710. Fell — Caiu (passado de fall)
725. Please — Por favor / Agradar
730. Caught — Pegado / Capturado (passado de catch)
733. Spoke — Falou / Discursou (passado de speak)
741. Student — Estudante / Aluno
787. Send — Enviar / Mandar
843. Thank — Agradecer / Obrigado
854. Apple — Maçã
855. Bought — Comprado (passado de Buy)
856. Led — Liderou (passado de Lead)
912. Meant — Significou / Pretendeu (passado de mean)
916. Lunch — Almoço / Almoçar
917. Monday — Segunda-feira
920. Juice — Suco
921. Park — Parque / Estacionar
925. Dinner — Jantar
927. Breakfast — Café da manhã
928. Bus — Ônibus
930. Phone — Telefone / Ligar
938. Garage — Garagem / Oficina
948. Airport — Aeroporto
956. Holiday — Feriado / Férias
957. Orange — Laranja / Laranjado
967. Chocolate — Chocolate
989. Hotel — Hotel
992. Cheese — Queijo
1000. Awesome — Incrível / Espetacular / Fantástico
`;

const RAW_PHRASES_TEXT = `
Quem você está procurando? — Who are you looking for?
Estou à procura de um emprego. — I'm looking for a job.
Qual é o problema? — What's the problem?
Eu preciso de dinheiro. — I need money.
Por favor, dê-me isso. — Please give it to me.
Você está brincando comigo? — Are you kidding me?
Eu não tenho dinheiro. — I don't have money.
Você está pronto para fazer o pedido? — Are you ready to order?
Você é tão gentil. — You are so kind.
Você se lembra de mim? — Do you remember me?
Eu não entendo. — I don't understand.
Eu estou perdido. — I am lost.
Quem é você? — Who are you?
Onde você mora? — Where do you live?
Eu sou de Nova York. — I am from New York.
Quantos anos você tem? — How old are you?
Tenho 35 anos de idade. — I am 35 years old.
Por favor, fale mais devagar. — Please speak more slowly.
Eu preciso de mais informações. — I need more information.
Qual é o seu nome? — What is your name?
Meu nome é Julia. — My name is Julia.
Você sabe onde eu posso pegar um táxi? — Do you know where I can get a taxi?
Tenha cuidado, não caia. — Be careful, don't fall.
Obrigado. — Thank you.
Posso falar com você amanhã? — Can I see you tomorrow?
Estou de férias. — I am on vacation.
Está tanto calor hoje. — It is very hot today.
Estou com fome. — I am hungry.
Eu quero comer pizza. — I want to eat pizza.
Onde estão as chaves? — Where are the keys?
Eu perdi minhas chaves. — I lost my keys.
Por favor, me ajude. — Please help me.
Desculpe, onde fica o banheiro? — Excuse me, where is the toilet?
O trem já partiu. — The train has already left.
Você está em casa? — Are you at home?
Estou no aeroporto. — I am at the airport.
Quando chega o avião? — When does the plane arrive?
Acabo de chegar. — I just arrived.
Você pode me chamar um táxi? — Can you call me a taxi?
O que você gostaria de comer? — What would you like to eat?
Quanto custa? — How much is it?
Eu vou visitar meu pai. — I am going to visit my father.
Você me entende? — Do you understand me?
Onde fica o banco mais próximo? — Where is the nearest bank?
Eu me sinto doente. — I feel sick.
Que horas são? — What time is it?
O café é muito quente. — The coffee is very hot.
Onde está meu telefone? — Where is my phone?
Eu gosto de você. — I like you.
Eu tenho dois filhos. — I have two children.
Você gosta desta cor? — Do you like this color?
O que você faz? — What do you do?
É um belo dia. — It is a beautiful day.
Entre. — Come in.
É verdade? — Is it true?
Vamos dançar. — Let's dance.
Está escuro. — It is dark.
Como você sabe? — How do you know?
Venha comigo. — Come with me.
A que horas você se levanta? — What time do you get up?
Por favor, sente-se. — Please sit down.
Isso é legal. — That's cool.
Tente novamente. — Try again.
Eu estava ocupado hoje. — I was busy today.
Quando você está livre? — When are you free?
Eu fiz isto. — I made this.
Onde você trabalha? — Where do you work?
Como é o clima? — What is the weather like?
É fácil. — It is easy.
O que isso significa? — What does this mean?
Já é tarde. — It is late.
Qual é o preço? — What is the price?
É cedo. — It is early.
Onde você está? — Where are you?
Eu não gosto disso. — I don't like it.
Desejo-lhe o melhor. — I wish you the best.
Eu estou com minha família. — I am with my family.
Este é o seu carro? — Is this your car?
Eu estou no meu carro. — I am in my car.
Eu gosto de ler livros. — I like reading books.
Eu estou com meus amigos. — I am with my friends.
Como você se sente? — How do you feel?
Eu me sinto bem. — I feel good.
Eu não sei. — I don't know.
Envie-me uma mensagem. — Send me a message.
Durma bem. — Sleep well.
Eu tenho uma pergunta. — I have a question.
Onde você estava? — Where were you?
Mais uma vez. — One more time.
Tome cuidado. — Take care.
Ele é meu irmão. — He is my brother.
Eu moro sozinho. — I live alone.
Eu vivo com minha família. — I live with my family.
Aonde você foi? — Where did you go?
Você pode repetir, por favor? — Can you repeat, please?
Não se preocupe. — Don't worry.
Você é um bom professor. — You are a good teacher.
Venha aqui. — Come here.
Quando você virá? — When will you come?
Eu virei amanhã. — I will come tomorrow.
Eu tenho um problema. — I have a problem.
Eu tenho um presente para você. — I have a gift for you.
Acenda a luz. — Turn on the light.
A conta, por favor. — The bill, please.
Desligue a música. — Turn off the music.
Mantenha o troco. — Keep the change.
Posso pagar com cartão de crédito? — Can I pay with a credit card?
Divirta-se! — Have fun!
Eu gostaria de pão com queijo. — I would like bread with cheese.
Eu vou esperar por você. — I will wait for you.
Vamos para o parque. — Let's go to the park.
Espere por mim. — Wait for me.
Fale devagar. — Speak slowly.
Eu estou aqui para ajudar. — I am here to help.
Envie o pacote para minha casa. — Send the package to my house.
Tenho certeza. — I am sure.
Eu estou pronto. — I am ready.
Eu tive um sonho. — I had a dream.
O que você estudou? — What did you study?
Bom dia. — Good morning.
Você está ocupado? — Are you busy?
Sim, estou ocupado. — Yes, I am busy.
Eu quero ir com você. — I want to go with you.
Você é meu melhor amigo. — You are my best friend.
Olá. — Hello.
Vejo você em breve. — See you soon.
Ela é minha irmã. — She is my sister.
Sinto muito. — I am sorry.
Vejo você mais tarde. — See you later.
Você está livre? — Are you free?
Sim, estou livre. — Yes, I am free.
Como você está? — How are you?
Eu estou bem, e você? — I'm fine, and you?
Podemos nos encontrar amanhã. — We can meet tomorrow.
Abra a janela. — Open the window.
Vou abrir a porta. — I will open the door.
Prazer em conhecê-lo. — Nice to meet you.
Boa tarde. — Good afternoon.
Vejo você amanhã. — See you tomorrow.
Boa noite. — Good night.
Você me viu? — Did you see me?
Estou com sede. — I am thirsty.
Eu preciso de água. — I need water.
Feche a porta. — Close the door.
Você pode me ajudar? — Can you help me?
Eu o ajudarei. — I will help you.
Eu cheguei tarde. — I arrived late.
Eu cheguei cedo. — I arrived early.
Eu preciso estudar. — I need to study.
Que dia é hoje? — What day is today?
É segunda-feira. — It is Monday.
Tenha um bom dia. — Have a nice day.
Você também. — You too.
Ontem. — Yesterday.
O que você fez ontem? — What did you do yesterday?
Amanhã. — Tomorrow.
De onde você é? — Where are you from?
É quase Natal. — It's almost Christmas.
O que você gostaria de beber? — What would you like to drink?
Bem-vindo. — Welcome.
Muito tempo sem ver. — Long time no see.
Feliz Ano Novo! — Happy New Year!
Feliz aniversário! — Happy birthday!
Feliz Natal! — Merry Christmas!
Quando é seu aniversário? — When is your birthday?
`;

export function getCatalogWords(): RawWordCatalogItem[] {
  return RAW_WORDS_TEXT.trim()
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const match = line.match(/^(\d+)\.\s*([^—]+)—\s*(.+)$/);
      if (!match) {
        return {
          rank: 0,
          english: line,
          portuguese: '',
          category: 'general' as const,
        };
      }
      const rank = Number(match[1]);
      const english = match[2].trim();
      const portuguese = match[3].trim();
      const isIrregularPast = portuguese.toLowerCase().includes('passado de');
      return {
        rank,
        english,
        portuguese,
        category: isIrregularPast ? ('past_irregular' as const) : ('general' as const),
      };
    });
}

export function getCatalogPhrases(): RawPhraseCatalogItem[] {
  return RAW_PHRASES_TEXT.trim()
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const parts = line.split('—').map((p) => p.trim());
      const portuguese = parts[0] ?? '';
      const english = parts[1] ?? '';
      const requiredWords = english
        .toLowerCase()
        .replace(/[.,!?;:]/g, '')
        .split(/\s+/)
        .filter(Boolean);
      return {
        id: index + 1,
        portuguese,
        english,
        requiredWords,
      };
    });
}
