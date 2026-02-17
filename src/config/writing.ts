export type ContentBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'quote'; text: string; attribution?: string }
  | { type: 'verse'; lines: string[]; attribution?: string }
  | { type: 'image'; src: string; caption?: string; alt: string }
  | { type: 'heading'; text: string }
  | { type: 'citation'; entries: string[] }

export interface WritingSample {
  slug: string
  title: string
  subtitle?: string
  date: string
  tags: string[]
  excerpt: string
  body: ContentBlock[]
}

export const writingSamples: WritingSample[] = [
  {
    slug: 'lyrical-conceptions-of-self-and-nation',
    title: 'Lyrical Conceptions of Self and Nation',
    subtitle: 'American Beginnings in Walt Whitman and Langston Hughes',
    date: '2016-05-18',
    tags: ['academic', 'poetry', 'literary criticism'],
    excerpt:
      'The poetry of Whitman and Hughes, though separated by decades, share the ethos of defining the American democratic experiment in relation to the dramatic voice \u2014 a tradition linked to the continual renewal of the project of a modern and truly egalitarian society.',
    body: [
      {
        type: 'paragraph',
        text: 'For much of the 19th century the literary productions of the still relatively young United States were largely viewed in the transatlantic community as lacking the refinement and prestige of the rich canon of European history. In a century which saw rapid expansion of industrial output on the backs of African-Slaves, and the expansion and claiming of westward North American lands, American writers and poets were confronted with an increasing need to proclaim a national literature, a national character and consciousness distinct from prior traditions. No poet has been credited more with this achievement than Walt Whitman. In his famous preface to Leaves of Grass, he makes one of many provocative claims to come in his verse; \u201cThe United States themselves are essentially the greatest poem\u201d (Ramazani, 865). Whitman professed a great faith in the poetic wellspring of the U.S, saying that the \u201cgenius of the United States is \u2026 always most in the common people\u201d (866). In addition, he conceives of the very concept of nationhood or nationality as being closely linked with \u201cpoetical nature\u201d (865), that \u201cThe soul of the largest and wealthiest and proudest nation may well go half-way to meet that of its poets\u201d (869). The ethos of Whitman is that of equality, of the beauty exuding from all nature and all subjects rude or delicate, of simplicity and \u201cAmerican expression\u201d (869). A brief summation of this aesthetic comes through powerfully in the poem \u201cTo the Prevailing Bards\u201d:',
      },
      {
        type: 'verse',
        lines: [
          'Comrades! I am the bard of Democracy',
          'Others are more correct and elegant than I, and more at home in',
          '\u2003the parlors and schools than I,',
          'But I alone advance among the people en-masse, coarse and strong',
          'I am he standing first there, solitary chanting the true America,',
          'I alone of all bards, am suffused as with the common people.',
        ],
        attribution: 'P\u00f6hlmann, 43',
      },
      {
        type: 'paragraph',
        text: 'For Whitman, the conception of an American literary voice is bound up in the future potential of the American democratic experiment.',
      },
      {
        type: 'paragraph',
        text: 'Sascha P\u00f6hlmann\u2019s book Future-Founding Poetry places Whitman at the forefront of a lineage of American poets concerned with the future of America, the new evolutions compounding the improvement of democracy and its relation to the individual. In her words, \u201cI am appropriating a term Whitman coined in his preface to the 1876 edition of Leaves of Grass. It offers a programmatic statement for his entire poetic project: \u2018Finally, as I have lived in fresh lands, inchoate, and in a revolutionary age, future-founding, I have felt to identify the points of that age, these lands, in my recitatives, altogether in my own way\u2019\u201d (P\u00f6hlmann, 17). She points out that \u201cthe very imagination of America itself, has for centuries relied so heavily on tropes of beginnings and futures that they have become stereotypical. America is undoubtedly the place of beginnings in modernity, the very site of the future: the New World, the land of opportunity\u201d (P\u00f6hlmann, 1). The very founding of the U.S in the previous century was seen as essentially a new beginning for just about everything. P\u00f6hlmann quotes lines from Thomas Paine\u2019s Common Sense:',
      },
      {
        type: 'quote',
        text: 'We have it in our power to begin the world over again. A situation, similar to the present, hath not happened since the days of Noah until now. The birth-day of a new world is at hand, and a race of men perhaps as numerous as all Europe contains, are to receive their portion of freedom from the event of a few months.',
        attribution: 'P\u00f6hlmann, 2',
      },
      {
        type: 'paragraph',
        text: 'The \u201cfuture-founding\u201d continuum in American poetry which P\u00f6hlmann puts Whitman at the helm of she defines as: \u201cpoetry that aims to actively mark and perform a beginning that is relevant to a combined imagination of both present and future. This is based on the assumption that the future is not simply somehow there, just like place is never just there, but that it is a concept that needs to be actively constructed, produced, and maintained in imaginative and material processes\u201d (P\u00f6hlmann, 2). Viewed in this light, American literature, and therefore America herself has the constant job of self-reflexive reevaluation and repeated confrontation to found new beginnings for American art and democracy. It is also important to note however P\u00f6hlmann\u2019s contention that \u201cfuture-founding poetry undoubtedly plays its part in a larger cultural attempt to claim futurity (and newness, progress, etc.) as American and nationalize beginnings themselves, yet it also\u2014and more so, in my opinion\u2014opposes this process as an undue limitation imposed on conceptualizations and imaginations of futurity, and it also works to liberate the future and the beginning from the national rather than fuse them for good\u201d (P\u00f6hlmann, 3). In other words, future founding poetry in America, though imagining futurity for a national context, looks beyond that limitation to imagine a conception of the future that is post-national, America being itself a \u201cteeming nation of nations\u201d (Ramazani, 865). Furthermore, Whitman articulates the belief that the contemplation or continual presence of the potential of futurity is necessary to create any meaning at all:',
      },
      {
        type: 'quote',
        text: 'As ever, all tends to followings\u2014America, too, is a prophecy. What, even of the best and most successful, would be justified by itself alone? by the present, or the material ostent alone? Of men or States, few realize how much they live in the future. That, rising like pinnacles, gives its main significance to all You and I are doing to-day. Without it, there were little meaning in lands or poems\u2014little purport in human lives.',
        attribution: 'P\u00f6hlmann, 26',
      },
      {
        type: 'paragraph',
        text: 'The above manuscript in Whitman\u2019s own hand from the Walt Whitman Archive of the Boston Public Library, gives some interesting insight to the poet\u2019s conception of the goals of his work. A list of qualities populates one page, including the bold though somewhat cryptic entries \u201cperfect sanity, Divine Instinct, breadth of vision, healthy rudeness of body, withdrawnness, gayety\u201d, and the most poetic, \u201csun-tan and air-sweetness\u201d (Whitman Archive, Mss. 3).',
      },
      {
        type: 'image',
        src: '/writing/whitman-hughes-000.jpg',
        alt: 'Walt Whitman manuscript from the Boston Public Library \u2014 a handwritten list of poetic qualities including "Perfect Sanity, Divine Instinct, Breadth of Vision, Healthy rudeness of Body, Withdrawnness, Gayety, Sun-tan & Air-sweetness"',
        caption: 'Walt Whitman Archive, Mss. 3 \u2014 Boston Public Library',
      },
      {
        type: 'paragraph',
        text: 'My own transcription of the second archive pictured below shows Whitman laying out some of the more specific (and lofty) ambitions of his poetry:',
      },
      {
        type: 'quote',
        text: 'I have attempted to construct a poem on the open principles of Nature, not only comprehended as the material worlds of astronomy with the earth and sea, but as in all the movements of civilization, wars, the shows of cities and in Man with all his attributes, animal, physical, intellectual and spiritual. My book is intended to be new, American\u2014 and the whole drift of my book is to form for the United States to come a new race\u2026 Is not meant to amuse, and will surely repel those who have been fed on so called fine poetry. \u2026 Every page of my book emanates Democracy, absolute, without the slightest compromise.',
        attribution: 'Whitman Archive, Mss. 9',
      },
      {
        type: 'image',
        src: '/writing/whitman-hughes-001.jpg',
        alt: 'Walt Whitman manuscript from the Boston Public Library \u2014 handwritten notes on his poetry and its ambitions, heavily revised with cross-outs and insertions',
        caption: 'Walt Whitman Archive, Mss. 9 \u2014 Boston Public Library',
      },
      {
        type: 'paragraph',
        text: 'While I have focused thus far on Whitman\u2019s aesthetic legacy, and called into view the notion of a \u2018future-founding\u2019 tradition, what I aim to show is that another later American poet, Langston Hughes is linked to Whitman in his poetic legacy, and the two poets represent instances of new beginnings in American art, as well as calling forward the future of democracy. The poetry of Whitman and Hughes, though separated by decades, share the ethos of defining or evaluating the American democratic experiment in relation to the dramatic voice. Because of this shared purpose, their poetry speaks to both the inception of an American lyrical tradition and its self-referential and continuous evolution. Both of these artists situate their work as calling for, and hoping for, the refining and expanding of a national literature, unconstrained by formal pretensions and rooted in common culture. While Whitman proclaims that \u201camid all her knowledge America knows almost nothing of herself or her real destination and life\u201d (Whitman Mss. 9), the later work of Hughes shows an America with a painfully split consciousness, a nation which especially for Afro-Americans, has not lived up to Whitman\u2019s democracy.',
      },
      {
        type: 'heading',
        text: 'Hughes and the Harlem Renaissance',
      },
      {
        type: 'paragraph',
        text: 'The Harlem Renaissance era productions of Langston Hughes represent a continuation of the \u201cAmerican monologue\u201d begun by Whitman, and are influenced by the latter\u2019s Transcendental ideas of self-esteem and self-reliance, breadth of poetic vision, and non-discrimination of subject matter. Furthermore, Hughes\u2019 poems show a pointed change from the faithfully seeking spirit of Whitman to the weariness, dislocation and fragmentation of the individual in the modern post WWI era. Hughes\u2019 work is a revisitation of the American, and more broadly democratic vision of future potential begun by Whitman. Both poets are concerned with beginnings, with dreams of future potentiality proclaimed by original native art. Because of their similarities, and in spite of their divergences, the relationship between the body of work left by these poets highlights the strength of the American literary tradition to continually expose and re-reflect the state of the American democratic \u201cI\u201d across centuries, a repeated distillation of culture confronting itself, evaluating itself, and imagining its futurity in an aesthetic of renewal that is distinctly American. Furthermore, the influence of musicality on their poetry is an important link I will discuss because of Hughes\u2019s close relationship to emerging Afro-American Jazz and Blues tradition, a new and uniquely American art form rooted in common vernacular and the racial struggles that have persisted since Whitman\u2019s post Civil-War era.',
      },
      {
        type: 'paragraph',
        text: 'The appeal that a poet like Whitman would have for African Americans makes sense. Whitman\u2019s poetry, probably most alive for today\u2019s readers in his Song of Myself, preaches the Transcendental attitudes of Ralph Waldo Emerson in self-reliance and self-esteem, and the equality and beauty of all nature\u2019s creations. These themes, as well as the hopefulness of lines like: \u201cthe past and present wilt\u2014 I have fill\u2019d them, emptied them, And proceed to fill my next fold of the future\u201d speak an uplifting message for the future-focused minds of a persecuted race in America. George B. Hutchinson\u2019s essay \u201cWhitman and the Black Poet: Kelly Miller\u2019s Speech to the Walt Whitman Fellowship\u201d examines this Afro-American interest in Whitman and argues that \u201cThe recorded black response to Whitman can be traced back to a speech Kelly Miller delivered to the first annual meeting of the Walt Whitman Fellowship on 31 May 1895 and published in the July issue of The Conservator, Horace Traubel\u2019s magazine\u201d (Hutchinson, 48). Hutchinson also supports my argument that Whitman\u2019s influence on the Harlem Renaissance is tangible. He says that Miller\u2019s speech \u201cprefigures some of the most significant directions taken by black literature and criticism of the Harlem Renaissance\u201d (Hutchinson, 47). The date of the speech itself is also significant, coming years before Langston Hughes\u2019s birth and in the same year that Booker T. Washington delivered his \u2018Atlanta Exposition Address\u2019, an event that helped elevate him as a leadership figure for the race. Hughes himself was also invited to speak for the Whitman foundation in 1927, and as Hutchinson cites, Hughes stressed \u201caccording to Arnold Rampersad, \u2018Whitman\u2019s humane depiction of blacks\u2019 as well as described \u2018modern free verse, and his own work, as descending from Whitman\u2019s great example\u2019\u201d (Hutchinson, 50). Miller\u2019s speech prefigured and looked forward to the evolution of African American art that would be later embodied by early 20th century modern poets including Hughes.',
      },
      {
        type: 'paragraph',
        text: 'In Miller\u2019s own words from the event he proclaims: \u201cThere is no variety of the human race that cannot find in him that which is adapted to their peculiar needs\u201d \u2026 and Hutchinson adds that the speech espouses the view \u201cthat Whitman had transcended the limitations of other writers of his race and reached a higher plane of understanding, of \u2018humanism\u2019\u201d (Hutchinson, 50). One of Miller\u2019s direct quotes from Whitman speaks volumes for their shared conviction to base native American art on new forms that need not follow canonized European ideals and conventions:',
      },
      {
        type: 'quote',
        text: 'No fine romance, no inimitable delineation of character, no grace of delicate illustration, no picture of shore or mountain or sky, no deep thought of the intellect, is so important to a man as his opinion of himself is; everything receives its tinge from that. In the verse of all those undoubtedly great writers\u2014Shakspere just as much as the rest\u2014there is the air which to America is the air of death. The mass of the people, the laborers and all who serve, are slag, refuse. The countenances of kings and great lords are beautiful; the countenances of mechanics ridiculous and deformed. What play of Shakspere as represented in America is not an insult to America, to its marrow and to its bones?',
        attribution: 'Hutchinson, 54',
      },
      {
        type: 'paragraph',
        text: 'Whitman takes characteristically bold pride in asserting a new literary sensibility to which old tradition is an \u201cinsult\u201d to the unfolding potential of the new world and its new democracy. More than just sharing this preference of Whitman\u2019s towards newness, Miller saw in him the call to a future for blacks in which not only the physical bonds of the slave industry have been broken, but also a rising freedom of consciousness, of self-knowledge, and spiritual liberation manifested through art. An important nod to Whitman is made in his speech when he declares:',
      },
      {
        type: 'quote',
        text: 'America has broken the shackles which bound four millions of human beings to a degraded life. But the bondage of the body is nothing compared with the slavery of the soul. Whitman sounds the key-note of the higher emancipation.',
        attribution: 'Hutchinson, 56',
      },
      {
        type: 'paragraph',
        text: 'In keeping with this emancipation of soul, Miller is confident that it can only lead in the direction of a new beginning in African-American, and therefore American poetry. He summarizes, \u201cWhitman has a special meaning to the negro not only because of his literary portrayal; he has positive lessons also. He inculcates the lesson of ennobling self-esteem. He teaches the negro that \u2018there is no sweeter fat than sticks to his own bones.\u2019 He urges him to accept nothing that \u2018insults his own soul\u2019\u201d (Hutchinson, 56). While there are mentions and vignettes of negroes of Whitman\u2019s time in Song of Myself, the passages that take on a more holistic transcendental tone like this passage from section 48 are often the ones that could be imagined some of the most uplifting to the audience that Miller represented:',
      },
      {
        type: 'verse',
        lines: [
          'I have said that the soul is not more than the body,',
          'And I have said that the body is not more than the soul,',
          'And nothing, not God, is greater to one than one\u2019s self is,',
          'And whoever walks a furlong without sympathy walks to his own funeral',
          '\u2003drest in his shroud,',
          'And I or you pocketless of a dime may purchase the pick of the earth,',
          'And to glance with an eye or show a bean in its pod confounds the',
          '\u2003learning of all times,',
          'And there is no trade or employment but the young man following it',
          '\u2003may become a hero,',
          'And there is no object so soft but it makes a hub for the wheel\u2019d universe,',
          'And I say to any man or woman, Let your soul stand cool and composed',
          '\u2003before a million universes.',
        ],
        attribution: 'Whitman, Song of Myself, \u00a748 (Ramazani, 15)',
      },
      {
        type: 'paragraph',
        text: 'In this passage Whitman\u2019s liberation of soul and the primacy of selfhood invokes not only a call for sympathy in his own time for those \u201cpocketless of a dime\u201d, but has also a tone that is distinctly future focused. The \u201clearning of all times\u201d, past times, is belittled in comparison to the present and perpetual wonders of nature, and bears no weight upon the individual spirit that may \u201cbecome a hero\u201d. The third line from the end is simultaneously a transcendental maxim of the oneness of the \u201cwheel\u2019d universe\u201d as well as a reiteration of the idea that no subject matter is unfit, \u201cno object so soft\u201d for art or poetry, and a new beginning hides in all perspectives and experiences.',
      },
      {
        type: 'heading',
        text: 'Hughes, Beginnings, and "I, Too"',
      },
      {
        type: 'paragraph',
        text: 'In terms of \u2018beginnings\u2019 as they relate to Langston Hughes, his work is more charged by a distinct and urgent desire to invoke future possibility to effect the present in a political sense. If Whitman is content with the perpetual newness of experience and of the self, what P\u00f6hlmann calls \u201citerative\u201d beginnings, Hughes\u2019 voice aims at a necessary purpose for cultural and political standing as an African-American while standing on the foundation of Whitman\u2019s openness, self-reliance, and democratic prophecy. The effect Hughes strives for is more dire in that it is \u201cnot made in the name of cultivating the openness of the future but rather for the sake of having a future in the first place\u201d (P\u00f6hlmann 159). Hughes\u2019s poem \u201cI, Too\u201d serves as an excellent example that illustrates some poetic and aesthetic links from Hughes to Whitman, in addition to characterizing his more politically charged form of future-founding. Furthermore, the prosody of the poem reflects its author\u2019s relationship to the musicality of African-American tradition, marking a distinction between musicality of form versus effect.',
      },
      {
        type: 'paragraph',
        text: 'The appended photos are taken from Nancy Cunard\u2019s NEGRO Anthology published in 1934. A major point of the bibliographic code of NEGRO is the first two pages, which frame Langston Hughes\u2019 poem \u201cI, Too\u201d strikingly on its own expansive page in the large volume, invoking American shame, and opposite is a full page photograph of a presumably working class black man in New York captioned \u201cAn American Beast of Burden\u201d (Cunard, 1\u20132). The bibliographic coding at work here is clearly for political effect. The first lines of Cunard\u2019s foreword for the anthology states the volumes\u2019 mission for \u201cthe recording of the struggles and achievements, the persecutions and the revolts against them, of the Negro peoples\u201d (Cunard, iii). Cunard goes on to describe Hughes specifically as \u201cthe revolutionary voice of liberation\u201d (Cunard, iv). In \u2018I, Too\u2019, we can hear Hughes\u2019 echoing of Whitman with his \u2018singing\u2019 of America, and it is hard to let go of the idea that the title is grouping Hughes specifically with Whitman. The tone and diction is very reminiscent of Whitman, yet the poem features shorter line breaks that recall the form of his blues poems. Like Whitman, Hughes is portraying an American scene, but a revised one. The poem is painfully conscious of its relation to the U.S as an \u2018other\u2019. It confronts modern American racism with a proclamatory and confident \u201cI\u201d, the \u201cI\u201d that is growing strong and predicting the capitalized \u201cThen\u201d, the future of the democracy that America ought to be or has claimed to be. This is a re-visitation of Whitman\u2019s \u2018American prophecy\u2019 that is also owning a beginning of new forms, and a founding of the future.',
      },
      {
        type: 'image',
        src: '/writing/whitman-hughes-003.jpg',
        alt: 'Page from Nancy Cunard\'s NEGRO Anthology (1934) featuring Langston Hughes\u2019 poem "I, Too" printed on its own full page',
        caption: 'Nancy Cunard, NEGRO Anthology (1934) \u2014 \u201cI, Too\u201d by Langston Hughes',
      },
      {
        type: 'image',
        src: '/writing/whitman-hughes-002.jpg',
        alt: '"An American Beast of Burden" \u2014 photograph of a working class black man in New York, from Nancy Cunard\'s NEGRO Anthology (1934)',
        caption: 'Nancy Cunard, NEGRO Anthology (1934) \u2014 \u201cAn American Beast of Burden,\u201d Photo by Howard Lester, New York',
      },
      {
        type: 'paragraph',
        text: 'As an experiment, it is striking to assemble \u201cI, Too\u201d in a form that is visually Whitmanesque, and notice how convincing it is:',
      },
      {
        type: 'verse',
        lines: [
          'I, too Sing America.',
          'I am the darker brother.',
          '',
          'They send me to eat in the kitchen when company comes;',
          'But I laugh, and eat well, and grow strong.',
          '',
          'Tomorrow I\u2019ll sit at the table when company comes,',
          'Nobody\u2019ll dare say to me, \u201cEat in the Kitchen\u201d Then.',
          '',
          'Besides, they\u2019ll see how beautiful I am and be ashamed\u2014',
          'I, too, am America.',
        ],
        attribution: 'Hughes, \u201cI, Too\u201d \u2014 arranged in Whitmanesque long-line form',
      },
      {
        type: 'heading',
        text: 'Musicality: The Blues and the Opera',
      },
      {
        type: 'paragraph',
        text: 'One of these new forms is the Blues, rooted in the spiritual hymns sung by slaves and rhythmic syncopation in its visual and auditory form. Blues frequently deals with reversals or appropriation of emotions and the confrontation of topics like death, injustice, or suicide. The direct dealing with death and injustice become the poem\u2019s weapons. Blues, like all poetry has a way of turning sorrow into an ally, or meeting it with clarity and bravery, like in Hughes\u2019s \u201cLife is Fine\u201d: \u201cYou may hear me holler, / You may see me cry / But I\u2019ll be dogged, sweet baby, / If you gonna see me die\u201d (Ramazani, 699). In \u201cI, Too\u201d, the shorter line style of his other blues poems is echoed, taking on a swift, vertical musicality while adopting and modernizing the tone of Whitman.',
      },
      {
        type: 'paragraph',
        text: 'Critic and poet Yusef Komunyakaa discusses the musical inspirations in the verse of Whitman and Hughes, saying that \u201cWhere Whitman had embraced the aria of the Italian opera (horizontal music), Hughes\u2019s divining rod quivered over the bedrock of the blues (vertical music). The short lines of the blues poems create a syncopated insistence and urgency. Art has to have tension. And it is the simultaneous laughter and crying that create the tension in Hughes\u2019s blues poetry\u201d (Komunyakaa, 1140). The connection of Whitman to musical tradition is more tenuous than Hughes, who wrote at a time when African-American music was reaching a golden age, while Whitman\u2019s era had not yet arrived at a consummately American music though he must have had faith that it would. Whitman claimed that it would take a \u201cphilosopher musician,\u201d not a literal musician to find the influence of music in his poetry (Krause, 714). Whitman hoped for his poetry, especially the long form Leaves of Grass to be received in listening with the same placid and objective openness that one might feel when they listen to an opera, a sort of cumulative effect of compounding sounds and images.',
      },
      {
        type: 'paragraph',
        text: 'Sydney Krauss elaborates on this topic, explaining that \u201cOne way of understanding Whitman\u2019s idea of a musical poetry is to construe music as an analogue of the great emotional potential he felt he had packed into his poems. He hoped that readers would get from the poetry sensations resembling those he found in music. However, whatever the signals for musical reception might be, they are probably not to be detected in conventional musical techniques. The sounds of music, of birds, of winds and waters, or of the city seem all on a par to Whitman\u201d (Krause, 718). For Hughes, the relationships between the blues, jazz, negro spiritual singing and the poetic form are much closer. If Whitman appreciated music and incorporated its influence in his poetry in an indirect way, Hughes apprehends music as not only a form containing the blues in his short and alternated rhymes, repetitions and refrains, but as a cultural signifier specific to the attitudes and experience of African Americans in Jim Crow racism. The more mystical and metaphysical ethos of Whitman\u2019s musicality are still unavoidable though. The strong yet ambiguous emotional force of music itself, rather than merely imbuing creative flow, is alive in Hughes\u2019 form, spaced for syncopation and call and response, and often emotionally chilling.',
      },
      {
        type: 'heading',
        text: 'Conclusion',
      },
      {
        type: 'paragraph',
        text: 'The continuum of American lyricism from the poles of Whitman and Hughes is a tradition that is linked to the continual renewal of the project of a modern and truly egalitarian society as embodied by America as a nation and as an ideal. Lyrical conceptions of self-hood are bound up in the promise of a native art that is intrinsically forward looking and self-affirming. The aesthetic of renewal shared by these poets is in fact a three pointed strength to American lyric tradition. There can be no progress without potential, and the perennial \u201cbeginnings\u201d of Whitman and Hughes develop the individual reader, the national context they participate in and imagine for the future, and the post-national theory that American art has an intrinsic universal quality. We may just as well suggest today as in any age previous that \u201cAmerica knows almost nothing of herself or her real destination and life\u201d, but the work already done in American letters by these important artists has at least strengthened for us the belief that Whitman shared, \u201call will come along in proper time\u201d (Whitman Archive, Mss. 9).',
      },
      {
        type: 'citation',
        entries: [
          'Cunard, Nancy. Negro. London: Published by Nancy Cunard at Wishart &, 1934. Print.',
          'Hutchinson, George B. \u201cWhitman and the Black Poet: Kelly Miller\u2019s Speech to the Walt Whitman Fellowship.\u201d American Literature 61.1 (1989): 46\u201358. JSTOR. Web. 09 May 2016.',
          'Komunyakaa, Yusef. \u201cLangston Hughes + Poetry = The Blues.\u201d Callaloo 25.4 (2002). JSTOR. Web. 9 May 2016.',
          'Krause, Sydney J. \u201cWhitman, Music, and Proud Music of the Storm.\u201d PMLA 72.4 (1957): 705\u201321. JSTOR. Web. 09 May 2016.',
          'Miller, R. Baxter. \u201c\u201cDEEP LIKE THE RIVERS\u201d The Lyrical Imagination.\u201d The Art and Imagination of Langston Hughes. U of Kentucky, 2006. JSTOR. Web.',
          'P\u00f6hlmann, Sascha. Future Founding Poetry: Topographies of Beginnings from Whitman to the Twenty-First Century. Oydell & Brewer, Camden House., 2015. JSTOR. Web. 9 May 2016.',
          'Ramazani, Jahan, Richard Ellmann, and Robert O\u2019Clair. The Norton Anthology of Modern and Contemporary Poetry: V.I. New York: W.W. Norton, 2003. Print.',
          'Whitman, Walt. MS Whitman Mss. 3, Whitman Archive. Boston Public Library.',
          'Whitman, Walt. \u201cNotes on His Poetry and Heine.\u201d MS Whitman Mss. 9, Whitman Archive. Boston Public Library.',
        ],
      },
    ],
  },
  {
    slug: 'diving-into-the-void',
    title: 'Diving into the Void',
    subtitle: 'The Passion According to G.H by Clarice Lispector',
    date: '2024-11-15',
    tags: ['literary criticism', 'philosophy', 'existentialism'],
    excerpt:
      'An exploration of Clarice Lispector\u2019s *The Passion According to G.H*, a shocking piece of literature which seeks an answer to existence itself, and its relationship to Milan Kundera\u2019s theories on the self and the unbearable lightness of being.',
    body: [
      {
        type: 'paragraph',
        text: 'Give me your hand: I\u2019m going to try to tell you of how Clarice Lispector gently and earnestly fractured my mere human joints, de-stabilizing the \u201cparalyzing security\u201d(12) of my third leg(s). *The Passion According to G.H* is a shocking piece of literature which seeks an answer to existence itself. In a flowing monologue that is at intervals neurotic, timid, courageous, and poetically unnerving, Lispector asks for the innocent reader\u2019s hand and pulls them into a dark hole, a hole of neutrality, of the indifferent molecular and elemental buzzing that is the blank canvas of all life and perceivable images. When G.H enters her maid\u2019s room to see the haunting hollowness of three figures outlined on the wall, and the cockroach that comes to symbolize a primordial, unthinking existence, she is about to confront \u201ca degree of living so originary that it bordered on the inanimate\u201d(15). This is not a book that can be discussed in any traditional sense. I lack Clarice\u2019s audacity to advise the reader on the unknowable, and so to enter this existential book, you must take her hand and mine, and hope for the best. One must offer their hand, and with fingers splayed half covering their squinting eyes, dare to look into the face of the inhuman, the inexpressive matter, the \u201cwhite matter\u201d, the fabric of the universe, (call it what you will!) that makes possible all that we consider to be reality.',
      },
      {
        type: 'paragraph',
        text: 'The core of this miniscule volume that somehow wrenches open a galaxy wide chasm of perception, is apprehension of the self. Milan Kundera offers helpful insight on this motif in his book *The Art of the Novel*. First, Kundera notes that \u201cThe paradoxical nature of action is one of the novels great discoveries\u201d(24). He is referring to the strange element in human nature that can make it impossible to predict the actions of an individual. More importantly, the individual\'s own ability to predict his actions is impaired. Humans commit irrationality. To get closer to a \u2018self\u2019, \u201cMan hopes to reveal his own image through his act, but that image bears no resemblance to him\u201d(24). If our own actions are so unintelligible, where do we find the self? The action in *G.H* is minimal, and internal. The largest movement in the whole book is the shocking decision to eat the cockroach in a macabre attempt to understand primal life. Utterly unpredictable, and altogether ineffectual, this event doesn\u2019t help G.H access her essential self (and thank \u2018God\u2019 for that). In fact, she has to *lose* herself momentarily to accomplish it, falling into a daze and waking up after the deed is done. But G.H already knew this about action. She has lived her life doing this or that action carried out by her \u2018third legs\u2019, what she labels as the fabrications humans make to anchor us to a reality. She suspects that reality to be false. She suspects that reality is more inhuman than it is human.',
      },
      {
        type: 'paragraph',
        text: 'G.H\u2019s losing of herself in that scene which I\u2019ll affectionately term the \u201clunch scene\u201d, raises another of Kundera\u2019s key points. The sensation of vertigo is defined by him as \u201cthe intoxication of the weak. Aware of his weakness, a man decides to give in rather than stand up to it\u201d(31). This weakness comes with the sense of despair that is the subject of one of his novels *\u201cThe Unbearable Lightness of Being\u201d.* It seems that G.H is facing the same lightness in her confrontation of the \u201csingeing nowness\u201d(94) of the divine neutrality of existence. If what G.H tries to see is \u201cGod\u201d, it is a neutral God, content with existence, and is nothing more than the invisible skeleton of the void. Kundera asks, \u201cBut if God is gone and man is no longer master, then who is master? The planet is moving through the void without any master. There it is, the unbearable lightness of being\u201d(41). This fear of the inconsequence of being, the vertigo it produces, and the elusive quest for \u2018the self\u2019, turns human reflection away from \u201cwonder at the immeasurable infinity of the soul\u201d and confounds it with \u201cwonder at the uncertain nature of the self and of its identity\u201d(Kundera 28). This is precisely the wonder that G.H attempts to express to the innocent reader. Lispector as an author seems to hold true to Kundera\u2019s theory that \u201cthe more powerful the lens of the microscope observing the self, the more the self and its uniqueness elude us\u201d(25). Of course, G.H has to go back to her human reality, and although feeling she has just sensed something profound, her humanness leaves the inevitable residue of perplexity. After 170 pages she admits, \u201cI don\u2019t understand what I am saying\u201d(173). Even so, it\u2019s clear she has said *something*, and something that is eerily beautiful. When meeting what we can\u2019t comprehend we either cower in its fearful beauty, or we ignore. G.H manages to *not* ignore for a small amount of time.',
      },
      {
        type: 'paragraph',
        text: 'When asked \u201cif the self and its uniqueness cannot be grasped in man\u2019s interior life, could it be grasped at all?\u201d, Milan Kundera replied: \u201cOf course not. The quest for the self has always ended, and always will end, in a paradoxical dissatisfaction. I don\u2019t say defeat.\u201d(25).',
      },
    ],
  },
]
