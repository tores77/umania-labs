-- Seed hardcoded blog articles migrated from MDX to Supabase
-- Run manually in Supabase SQL Editor after confirming the articles table exists.

-- ES: Por qué tu web no aparece en ChatGPT (y cómo solucionarlo)
INSERT INTO articles (
  article_id,
  title,
  content,
  seo_title,
  seo_description,
  slug,
  tags,
  status,
  locale,
  created_at
) VALUES (
  'por-que-tu-web-no-aparece-en-chatgpt-seed-2026-06-01',
  'Por qué tu web no aparece en ChatGPT (y cómo solucionarlo)',
  '<p>Hace dos años, aparecer en Google era suficiente. Hoy, cada vez más personas preguntan directamente a ChatGPT, Perplexity o Gemini — y esos sistemas deciden qué marcas mencionar sin que el usuario visite tu web.</p>
<p>En <strong>Umania Labs</strong>, nuestro studio de diseño web premium en <strong>Mallorca</strong>, auditamos la <strong>visibilidad en ChatGPT</strong> de decenas de negocios locales cada trimestre. El patrón se repite: webs impecables, buen SEO técnico, cero menciones en respuestas de IA.</p>
<p><em>Última actualización: 1 de junio de 2026</em></p>
<h2>¿Por qué tu negocio es invisible en ChatGPT?</h2>
<p>El resultado es preocupante pero predecible. Negocios con productos excelentes desaparecen de la nueva capa de búsqueda porque su presencia digital no está estructurada para los motores generativos.</p>
<p>En nuestras auditorías de <strong>GEO</strong> en Mallorca y España, aproximadamente el <strong>97% de los negocios no aparecen citados</strong> cuando alguien pregunta por su sector en ChatGPT. No es un dato aislado: el informe SAVI de SearchScore (Q1 2026, 850.000+ webs) sitúa la invisibilidad en IA en el <strong>71%</strong> a nivel global, mientras que Omni Eclipse documentó un <strong>88%</strong> en 1.700 negocios consultados manualmente en ChatGPT.</p>
<p>La brecha entre Google y la IA es real. Según Omni Eclipse, el <strong>77% de negocios que posicionan en la primera página de Google son invisibles en ChatGPT</strong>. Tener buen SEO ya no garantiza <strong>visibilidad en IA</strong>.</p>
<h2>¿Qué es GEO y por qué importa en 2026?</h2>
<p><strong>GEO</strong> (Generative Engine Optimization) es la disciplina de optimizar tu presencia digital para que los motores de IA te citen, te recomienden y te incluyan en sus respuestas.</p>
<p>No sustituye al SEO tradicional — lo complementa. Google sigue siendo crítico para tráfico directo y conversiones.</p>
<p>Pero si solo optimizas para Google, pierdes una fracción creciente de búsquedas que nunca generan un clic. En 2026, la pregunta relevante no es solo "¿aparezco en Google?" sino <strong>"¿me menciona la IA cuando alguien pregunta por mi sector en Mallorca?"</strong></p>
<h2>¿Cómo decide ChatGPT qué negocios citar?</h2>
<p>Los LLM no rastrean la web en tiempo real como Google. Construyen respuestas a partir de contenido indexado, autoridad percibida y señales de entidad.</p>
<p><strong>Contenido indexado:</strong> datos de entrenamiento más acceso web en vivo cuando está disponible. Si tu web bloquea GPTBot o no tiene HTML legible, no entras en el candidato pool.</p>
<p><strong>Autoridad percibida:</strong> menciones en fuentes que el modelo considera fiables — medios, directorios sectoriales, publicaciones especializadas. Según AirOps (2025), las marcas tienen <strong>6,5 veces más probabilidad</strong> de ser citadas a través de fuentes de terceros que desde su propio dominio.</p>
<p><strong>Claridad semántica:</strong> qué tan fácil es entender quién eres, qué haces y dónde operas. Un negocio en Mallorca que no declara explícitamente su ubicación, servicios y público objetivo queda fuera del radar semántico.</p>
<p><strong>Consistencia:</strong> si tu marca aparece descrita de formas distintas en web, LinkedIn, Google Business Profile y directorios, el modelo no consolida tu entidad.</p>
<p><strong>Frescura:</strong> el 76,4% de las páginas más citadas por ChatGPT se actualizaron en los últimos 30 días, según Ahrefs (~17M citaciones analizadas). El contenido estático de hace dos años pierde relevancia para la IA.</p>
<p>Un negocio con web genérica, sin schema markup, sin menciones externas y sin contenido estructurado tiene probabilidades mínimas de aparecer en una respuesta de IA.</p>
<h2>¿Qué puedes hacer hoy para mejorar tu visibilidad en IA?</h2>
<p>Estas cinco acciones son las que implementamos en <strong>Umania Labs</strong> para clientes en Mallorca. No requieren presupuesto masivo — requieren estructura y consistencia.</p>
<h3>¿Cómo estructurar tu contenido para que la IA te cite?</h3>
<p>Los LLM procesan mejor contenido que responde preguntas directas. En lugar de páginas genéricas tipo "Sobre nosotros", crea secciones como:</p>
<ul><li>"¿Qué servicios ofrece [tu marca] en Mallorca?"</li><li>"¿Cuánto cuesta una web premium para [tu sector]?"</li><li>"¿Por qué elegir [tu marca] frente a otras agencias?"</li></ul>
<p>Cada respuesta debe ser clara, específica y autocontenida. Las secciones de <strong>120-180 palabras</strong> entre encabezados reciben un <strong>70% más de citaciones en ChatGPT</strong>, según SE Ranking (noviembre 2025).</p>
<h3>¿Por qué el FAQ schema markup es crítico para GEO?</h3>
<p>El schema <code>FAQPage</code> ayuda tanto a Google como a los sistemas de IA a identificar pares pregunta-respuesta en tu web. Es implementación técnica directa — JSON-LD en el <code><head></code> de tus páginas clave.</p>
<p>Los estudios de optimización generativa (Princeton GEO, KDD 2024) muestran mejoras de visibilidad de hasta <strong>40%</strong> con fuentes autoritativas y estadísticas verificables. El FAQ schema refuerza esa estructura semántica.</p>
<h3>¿Cómo conseguir menciones que la IA considera fiables?</h3>
<p>Los LLM ponderan lo que encuentran en medios, directorios sectoriales, publicaciones especializadas y perfiles verificados. No se trata de spam de enlaces — se trata de <strong>presencia real</strong> en ecosistemas creíbles.</p>
<p>Para un negocio en <strong>Mallorca</strong>: directorios locales, prensa regional (Diario de Mallorca, Ultima Hora), asociaciones sectoriales, colaboraciones con marcas complementarias. Yext (octubre 2025, 6,8M citaciones analizadas) encontró que el <strong>86% de citaciones en IA</strong> provienen de fuentes gestionadas por la marca: web propia (44%) y fichas de negocio (42%).</p>
<h3>¿Qué es el lenguaje de entidad y por qué importa?</h3>
<p>Define con precisión: nombre de marca, ubicación, servicios, rango de precios, público objetivo. Repite esa misma formulación en tu web, Google Business Profile, LinkedIn, directorios y cualquier mención externa.</p>
<p>La inconsistencia confunde a los modelos. Esta formulación debe ser idéntica en todas partes:</p>
<p><strong>"Umania Labs, studio de diseño web premium en Mallorca especializado en webs con IA para HNWI y startups."</strong></p>
<p>Cuando auditamos negocios locales, la inconsistencia de entidad es el error más frecuente — y el más fácil de corregir.</p>
<h3>¿Con qué frecuencia debes publicar contenido para GEO?</h3>
<p>Los LLM favorecen contenido fresco y citado. Un blog con artículos mensuales sobre tu sector — casos reales, datos, metodología — refuerza tu autoridad temática mucho más que una web estática de cinco páginas.</p>
<p>No hace falta volumen. Hace falta <strong>consistencia y profundidad</strong>. Actualiza tus páginas clave al menos trimestralmente con un <strong>30% de contenido nuevo</strong>, según las recomendaciones de frescura para citaciones en IA.</p>
<blockquote><p>El 97% de los negocios no aparecen en respuestas de IA. No porque su producto sea malo — sino porque su presencia digital no está estructurada para este nuevo canal.</p></blockquote>
<h2>Preguntas frecuentes sobre visibilidad en ChatGPT</h2>
<h3>¿Qué es GEO y en qué se diferencia del SEO?</h3>
<p><strong>GEO</strong> (Generative Engine Optimization) optimiza tu presencia para que motores de IA te citen. El <strong>SEO</strong> persigue clics en resultados de búsqueda tradicionales. Se complementan: necesitas ambos en 2026.</p>
<h3>¿Por qué mi web no aparece en ChatGPT aunque posiciono bien en Google?</h3>
<p>Google mide enlaces, autoridad de dominio y relevancia de keywords. ChatGPT evalúa reconocimiento de entidad, datos estructurados, menciones en terceros y frescura. Son sistemas de selección distintos — posicionar en Google no transfiere automáticamente tu <strong>visibilidad en IA</strong>.</p>
<h3>¿Cuánto tarda en mejorar la visibilidad en IA?</h3>
<p>Con la estructura correcta — FAQ schema, lenguaje de entidad, contenido Q&A y menciones externas — la mayoría de negocios locales ven señales de mejora en <strong>4 a 8 semanas</strong>. En Umania Labs lo hemos comprobado con clientes de hostelería, inmobiliaria y servicios profesionales en Mallorca.</p>
<h3>¿Qué es la visibilidad en ChatGPT para un negocio local en Mallorca?</h3>
<p>Es la probabilidad de que ChatGPT te nombre cuando alguien pregunta por tu servicio en la isla. Por ejemplo: "mejor agencia web Mallorca" o "diseño web premium Palma". Depende de web estructurada, Google Business Profile completo, directorios locales y contenido con entidades claras.</p>
<h3>¿Puede Umania Labs auditar mi visibilidad en IA?</h3>
<p>Sí. Realizamos <strong>auditorías gratuitas de visibilidad en IA</strong> para negocios en Mallorca y España. Comprobamos si apareces citado en ChatGPT, Perplexity y Gemini, e identificamos los gaps concretos de <strong>GEO</strong>.</p>
<h2>¿Quieres saber si tu negocio aparece en ChatGPT?</h2>
<p>La buena noticia: <strong>GEO</strong> es implementable en semanas, no en años. No requiere rehacer tu web desde cero — requiere estructura, schema, contenido y consistencia.</p>
<p>¿Quieres saber si tu negocio aparece en ChatGPT cuando alguien busca tu servicio en Mallorca? Hacemos una auditoría gratuita de visibilidad en IA.</p>
<p><a href="/es#contact">Reserva tu auditoría gratuita de visibilidad en IA →</a></p>
<h2>Fuentes y referencias</h2>
<ol><li>SearchScore — *AI Search Visibility Index: State of the Web, Q1 2026* (850.000+ webs auditadas; 71% invisibles en IA). <a href="https://searchscore.io/savi-report/march-2026/">searchscore.io</a></li><li>Omni Eclipse — *2026 AI Search Visibility Report* (1.700 negocios; 88% invisibles en ChatGPT; 77% de page-1 Google invisibles en IA). <a href="https://omnieclipse.ai/blog/ai-search-visibility-report-2026">omnieclipse.ai</a></li><li>Ahrefs — *AI Citations Study* (~17M citaciones; 76,4% de páginas top actualizadas en 30 días). <a href="https://ahrefs.com/blog/ai-citations/">ahrefs.com/blog</a></li><li>SE Ranking — *ChatGPT Citation Patterns* (noviembre 2025; secciones 120-180 palabras +70% citaciones). <a href="https://seranking.com">seranking.com</a></li><li>Yext — *AI Citation Study* (octubre 2025; 6,8M citaciones; 86% de fuentes gestionadas por marca). <a href="https://www.yext.com">yext.com</a></li><li>Aggarwal et al. — *GEO: Generative Engine Optimization* (Princeton, KDD 2024). <a href="https://arxiv.org/abs/2311.09735">arxiv.org/abs/2311.09735</a></li></ol>
<h2>Sobre el autor</h2>
<p><strong>Pere Miquel Obrador</strong> es fundador de <strong>Umania Labs</strong>, studio de diseño web premium con sede en <strong>Mallorca</strong>. Lleva más de una década construyendo webs orientadas a conversión para HNWI, startups y negocios locales en las Islas Baleares.</p>
<p>En Umania Labs combina SEO técnico, <strong>GEO</strong> y agentes de IA integrados en cada proyecto. Escribe sobre visibilidad en motores generativos, arquitectura web y optimización para citaciones en ChatGPT, Perplexity y Gemini.</p>
<script type="application/ld+json">{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"¿Qué es GEO y en qué se diferencia del SEO?","acceptedAnswer":{"@type":"Answer","text":"GEO (Generative Engine Optimization) es la optimización de tu presencia digital para que motores de IA como ChatGPT, Perplexity y Gemini te citen en sus respuestas. El SEO tradicional persigue clics en Google; GEO persigue menciones en respuestas generadas por IA. Se complementan, no se sustituyen."}},{"@type":"Question","name":"¿Por qué mi web no aparece en ChatGPT aunque posiciono bien en Google?","acceptedAnswer":{"@type":"Answer","text":"Google y ChatGPT usan señales distintas. Un estudio de Omni Eclipse (2026) encontró que el 77% de negocios en la primera página de Google son invisibles en ChatGPT. La IA prioriza claridad de entidad, datos estructurados, menciones en terceros y frescura de contenido — no solo backlinks y keywords."}},{"@type":"Question","name":"¿Cuánto tarda en mejorar la visibilidad en IA?","acceptedAnswer":{"@type":"Answer","text":"Con estructura correcta — FAQ schema, lenguaje de entidad consistente, contenido en formato pregunta-respuesta y menciones externas — la mayoría de negocios locales ven señales de mejora en 4 a 8 semanas. No requiere rehacer la web desde cero."}},{"@type":"Question","name":"¿Qué es la visibilidad en ChatGPT para un negocio local en Mallorca?","acceptedAnswer":{"@type":"Answer","text":"Es la probabilidad de que ChatGPT te nombre cuando alguien pregunta por tu servicio en Mallorca — por ejemplo, ''mejor agencia web en Mallorca'' o ''diseño web premium Palma''. Depende de tu presencia en fuentes que el modelo considera fiables: web estructurada, Google Business Profile, directorios locales y contenido con entidades claras."}},{"@type":"Question","name":"¿Puede Umania Labs auditar mi visibilidad en IA?","acceptedAnswer":{"@type":"Answer","text":"Sí. En Umania Labs realizamos auditorías gratuitas de visibilidad en IA para negocios en Mallorca y España. Comprobamos si apareces citado en ChatGPT, Perplexity y Gemini cuando alguien busca tu servicio, e identificamos los gaps concretos de GEO."}}]}</script>',
  'Por qué tu web no aparece en ChatGPT (y cómo solucionarlo)',
  'El 97% de los negocios son invisibles en los nuevos motores de búsqueda de IA. Esto es lo que está pasando y cómo cambiarlo.',
  'por-que-tu-web-no-aparece-en-chatgpt',
  '{"GEO","ChatGPT","visibilidad IA","SEO 2026"}',
  'published',
  'es',
  '2026-06-01T12:00:00.000Z'
);

-- EN: Why Your Website Doesn't Appear in ChatGPT (And How to Fix It)
INSERT INTO articles (
  article_id,
  title,
  content,
  seo_title,
  seo_description,
  slug,
  tags,
  status,
  locale,
  created_at
) VALUES (
  'why-your-website-doesnt-appear-in-chatgpt-seed-2026-06-01',
  'Why Your Website Doesn''t Appear in ChatGPT (And How to Fix It)',
  '<p>Two years ago, ranking on Google was enough. Today, more people ask ChatGPT, Perplexity, or Gemini directly — and those systems decide which brands to mention without the user ever visiting your website.</p>
<p>At <strong>Umania Labs</strong>, our premium web design studio in <strong>Mallorca</strong>, we audit <strong>ChatGPT visibility</strong> for dozens of local businesses every quarter. The pattern repeats: polished websites, solid technical SEO, zero mentions in AI responses.</p>
<p><em>Last updated: June 1, 2026</em></p>
<h2>Why is your business invisible in ChatGPT?</h2>
<p>The result is concerning but predictable. Businesses with excellent products vanish from the new search layer because their digital presence isn''t structured for generative engines.</p>
<p>In our <strong>GEO</strong> audits across Mallorca and Spain, approximately <strong>97% of businesses don''t appear cited</strong> when someone asks about their sector in ChatGPT. This isn''t an outlier: SearchScore''s SAVI report (Q1 2026, 850,000+ websites) puts global AI invisibility at <strong>71%</strong>, while Omni Eclipse documented <strong>88%</strong> across 1,700 businesses manually queried in ChatGPT.</p>
<p>The gap between Google and AI is real. According to Omni Eclipse, <strong>77% of businesses ranking on Google''s first page are invisible in ChatGPT</strong>. Good SEO no longer guarantees <strong>AI visibility</strong>.</p>
<h2>What is GEO and why does it matter in 2026?</h2>
<p><strong>GEO</strong> (Generative Engine Optimization) is the discipline of optimizing your digital presence so AI engines cite you, recommend you, and include you in their answers.</p>
<p>It doesn''t replace traditional SEO — it complements it. Google remains critical for direct traffic and conversions.</p>
<p>But if you only optimize for Google, you lose a growing share of searches that never generate a click. In 2026, the relevant question isn''t just "Do I rank on Google?" but <strong>"Does AI mention me when someone asks about my sector in Mallorca?"</strong></p>
<h2>How does ChatGPT decide which businesses to cite?</h2>
<p>LLMs don''t crawl the web in real time like Google. They build answers from indexed content, perceived authority, and entity signals.</p>
<p><strong>Indexed content:</strong> training data plus live web access when available. If your site blocks GPTBot or lacks readable HTML, you never enter the candidate pool.</p>
<p><strong>Perceived authority:</strong> mentions in sources the model considers reliable — media, industry directories, specialist publications. According to AirOps (2025), brands are <strong>6.5 times more likely</strong> to be cited through third-party sources than from their own domain.</p>
<p><strong>Semantic clarity:</strong> how easy it is to understand who you are, what you do, and where you operate. A business in Mallorca that doesn''t explicitly declare its location, services, and target audience falls off the semantic radar.</p>
<p><strong>Consistency:</strong> if your brand is described differently across your website, LinkedIn, Google Business Profile, and directories, the model can''t consolidate your entity.</p>
<p><strong>Freshness:</strong> 76.4% of ChatGPT''s most-cited pages were updated within the last 30 days, according to Ahrefs (~17M citations analyzed). Two-year-old static content loses relevance for AI.</p>
<p>A business with a generic website, no schema markup, no external mentions, and no structured content has minimal chances of appearing in an AI response.</p>
<h2>What can you do today to improve your AI visibility?</h2>
<p>These five actions are what we implement at <strong>Umania Labs</strong> for clients in Mallorca. They don''t require massive budgets — they require structure and consistency.</p>
<h3>How should you structure content so AI cites you?</h3>
<p>LLMs process content that answers direct questions more effectively. Instead of generic "About us" pages, create sections like:</p>
<ul><li>"What services does [your brand] offer in Mallorca?"</li><li>"How much does a premium website cost for [your sector]?"</li><li>"Why choose [your brand] over other agencies?"</li></ul>
<p>Each answer should be clear, specific, and self-contained. Sections of <strong>120-180 words</strong> between headings receive <strong>70% more ChatGPT citations</strong>, according to SE Ranking (November 2025).</p>
<h3>Why is FAQ schema markup critical for GEO?</h3>
<p>The <code>FAQPage</code> schema helps both Google and AI systems identify question-answer pairs on your site. It''s straightforward technical implementation — JSON-LD in the <code><head></code> of your key pages.</p>
<p>Generative optimization studies (Princeton GEO, KDD 2024) show that adding authoritative sources and verified statistics can increase visibility in generative engines by up to <strong>40%</strong>. FAQ schema reinforces that semantic structure.</p>
<h3>How do you earn mentions that AI considers reliable?</h3>
<p>LLMs weight what they find in media, industry directories, specialist publications, and verified profiles. This isn''t link spam — it''s <strong>real presence</strong> in ecosystems the model considers credible.</p>
<p>For a business in <strong>Mallorca</strong>: local directories, regional press (Diario de Mallorca, Ultima Hora), industry associations, collaborations with complementary brands. Yext (October 2025, 6.8M citations analyzed) found that <strong>86% of AI citations</strong> come from brand-managed sources: own website (44%) and business listings (42%).</p>
<h3>What is entity language and why does it matter?</h3>
<p>Define precisely: brand name, location, services, price range, target audience. Repeat that same formulation on your website, Google Business Profile, LinkedIn, directories, and any external mention.</p>
<p>Inconsistency confuses models. This formulation must be identical everywhere:</p>
<p><strong>"Umania Labs, premium web design studio in Mallorca specializing in AI-powered websites for HNWI and startups."</strong></p>
<p>When we audit local businesses, entity inconsistency is the most frequent error — and the easiest to fix.</p>
<h3>How often should you publish content for GEO?</h3>
<p>LLMs favor fresh, cited content. A blog with monthly articles about your sector — real cases, data, methodology — reinforces your topical authority far more than a static five-page website.</p>
<p>Volume isn''t the point. <strong>Consistency and depth</strong> are. Update your key pages at least quarterly with <strong>30% new content</strong>, per AI citation freshness recommendations.</p>
<blockquote><p>97% of businesses don''t appear in AI responses. Not because their product is bad — but because their digital presence isn''t structured for this new channel.</p></blockquote>
<h2>Frequently asked questions about ChatGPT visibility</h2>
<h3>What is GEO and how does it differ from SEO?</h3>
<p><strong>GEO</strong> (Generative Engine Optimization) optimizes your presence so AI engines cite you. <strong>SEO</strong> pursues clicks in traditional search results. You need both in 2026 — they complement each other.</p>
<h3>Why doesn''t my website appear in ChatGPT even though I rank well on Google?</h3>
<p>Google measures links, domain authority, and keyword relevance. ChatGPT evaluates entity recognition, structured data, third-party mentions, and freshness. These are distinct selection systems — ranking on Google doesn''t automatically transfer your <strong>AI visibility</strong>.</p>
<h3>How long does it take to improve AI visibility?</h3>
<p>With the right structure — FAQ schema, entity language, Q&A content, and external mentions — most local businesses see improvement signals within <strong>4 to 8 weeks</strong>. At Umania Labs we''ve confirmed this with hospitality, real estate, and professional services clients in Mallorca.</p>
<h3>What is ChatGPT visibility for a local business in Mallorca?</h3>
<p>It''s the probability that ChatGPT names you when someone asks about your service on the island. For example: "best web agency Mallorca" or "premium web design Palma". It depends on a structured website, complete Google Business Profile, local directories, and content with clear entities.</p>
<h3>Can Umania Labs audit my AI visibility?</h3>
<p>Yes. We offer <strong>free AI visibility audits</strong> for businesses in Mallorca and Spain. We check whether you appear cited in ChatGPT, Perplexity, and Gemini, and identify specific <strong>GEO</strong> gaps.</p>
<h2>Want to know if your business appears in ChatGPT?</h2>
<p>The good news: <strong>GEO</strong> is implementable in weeks, not years. It doesn''t require rebuilding your website from scratch — it requires structure, schema, content, and consistency.</p>
<p>Want to know if your business appears in ChatGPT when someone searches for your service in Mallorca? We offer a free AI visibility audit.</p>
<p><a href="/en#contact">Book your free AI visibility audit →</a></p>
<h2>Sources and references</h2>
<ol><li>SearchScore — *AI Search Visibility Index: State of the Web, Q1 2026* (850,000+ websites audited; 71% invisible to AI). <a href="https://searchscore.io/savi-report/march-2026/">searchscore.io</a></li><li>Omni Eclipse — *2026 AI Search Visibility Report* (1,700 businesses; 88% invisible in ChatGPT; 77% of Google page-1 invisible in AI). <a href="https://omnieclipse.ai/blog/ai-search-visibility-report-2026">omnieclipse.ai</a></li><li>Ahrefs — *AI Citations Study* (~17M citations; 76.4% of top pages updated within 30 days). <a href="https://ahrefs.com/blog/ai-citations/">ahrefs.com/blog</a></li><li>SE Ranking — *ChatGPT Citation Patterns* (November 2025; 120-180 word sections +70% citations). <a href="https://seranking.com">seranking.com</a></li><li>Yext — *AI Citation Study* (October 2025; 6.8M citations; 86% from brand-managed sources). <a href="https://www.yext.com">yext.com</a></li><li>Aggarwal et al. — *GEO: Generative Engine Optimization* (Princeton, KDD 2024). <a href="https://arxiv.org/abs/2311.09735">arxiv.org/abs/2311.09735</a></li></ol>
<h2>About the author</h2>
<p><strong>Pere Miquel Obrador</strong> is founder of <strong>Umania Labs</strong>, a premium web design studio based in <strong>Mallorca</strong>. He has spent over a decade building conversion-focused websites for HNWI, startups, and local businesses across the Balearic Islands.</p>
<p>At Umania Labs he combines technical SEO, <strong>GEO</strong>, and integrated AI agents in every project. He writes about generative engine visibility, web architecture, and optimization for citations in ChatGPT, Perplexity, and Gemini.</p>
<script type="application/ld+json">{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"What is GEO and how does it differ from SEO?","acceptedAnswer":{"@type":"Answer","text":"GEO (Generative Engine Optimization) is the practice of optimizing your digital presence so AI engines like ChatGPT, Perplexity, and Gemini cite you in their responses. Traditional SEO pursues clicks on Google; GEO pursues mentions in AI-generated answers. They complement each other — they don''t replace each other."}},{"@type":"Question","name":"Why doesn''t my website appear in ChatGPT even though I rank well on Google?","acceptedAnswer":{"@type":"Answer","text":"Google and ChatGPT use different signals. An Omni Eclipse study (2026) found that 77% of businesses on Google''s first page are invisible in ChatGPT. AI prioritizes entity clarity, structured data, third-party mentions, and content freshness — not just backlinks and keywords."}},{"@type":"Question","name":"How long does it take to improve AI visibility?","acceptedAnswer":{"@type":"Answer","text":"With the right structure — FAQ schema, consistent entity language, Q&A-formatted content, and external mentions — most local businesses see improvement signals within 4 to 8 weeks. It doesn''t require rebuilding your website from scratch."}},{"@type":"Question","name":"What is ChatGPT visibility for a local business in Mallorca?","acceptedAnswer":{"@type":"Answer","text":"It''s the probability that ChatGPT names you when someone asks about your service in Mallorca — for example, ''best web agency in Mallorca'' or ''premium web design Palma''. It depends on your presence in sources the model considers reliable: structured website, Google Business Profile, local directories, and content with clear entities."}},{"@type":"Question","name":"Can Umania Labs audit my AI visibility?","acceptedAnswer":{"@type":"Answer","text":"Yes. At Umania Labs we offer free AI visibility audits for businesses in Mallorca and Spain. We check whether you appear cited in ChatGPT, Perplexity, and Gemini when someone searches for your service, and identify specific GEO gaps."}}]}</script>',
  'Why Your Website Doesn''t Appear in ChatGPT (And How to Fix It)',
  '97% of businesses are invisible in the new AI search engines. Here''s what''s happening and how to change it.',
  'why-your-website-doesnt-appear-in-chatgpt',
  '{"GEO","ChatGPT","AI visibility","SEO 2026"}',
  'published',
  'en',
  '2026-06-01T12:00:00.000Z'
);

