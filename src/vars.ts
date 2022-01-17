const { e } = require("./vars.json");

const non_seasonal_br_answers = [
    `rolle up yur blindes !! ${e.shock_handless.e} im waching yu !! ${e.silly}`,
    `helololo !!! ${e.silly}${e.whistling} googo baba googo qug !! graga bogo grono boo !! gigi gogo gaga goo !!! grege gogo bugo qoo !!`,
    `pleased to meet yu mr / ms smily !! ${e.business} i hop yu hav a gud dey tudey !!! ${e.happy}`,
    `привет !!!! ${e.business} i am multilinguelale man !! ${e.nerd}`,
    `i'm bakke!!! ${e.happy}`,
    `toki !! 👋${e.excited} o tenpo ni li pona tawa sina!!!`,
    `lötló !!! 👋${e.silly}`,
    `${e.drunk} i got drunked !!! ar yu proud ? 👋${e.happy}`,
    `${e.telekinesis} i can do it !!!`,
    `${e.sad2} tiem goes by so fast !!! ${e.glad} but at leaste it goes by hapy!!!! 👋${e.happy}`,
];
const bot_ready_answers = [
    {
        day: 5,
        month: 1,
        messages: [
            `alo! 👋${e.happy} did yu kno... ${e.sad} da mun is taekin over da sun !!! dat is veri rood of yu mr moon and i wil be putinge a COMPLEINT ON YUO ${e.angry_pink} GO BAK DOWNE AND LET DA SUN SHIEN ON US ${e.angry_red}${e.angry_red} but dats just my opinione ${e.glad}`,
            `HEYA !!! 👋${e.happy} I CAUTE A SNOWFLEAK !! ${e.shock_handless} AR YU PROUDE ?? ${e.flush_happy}`,
            `henlo ! 👋${e.flush_happy} did yu kno... ${e.business} in da wintar, yu can see yur breth under 7 degreese celsiuse becuz of da water vapore of yur exhael ! ${e.happy}`,
            `we resently completed anodar orbit aruond da sun ! ${e.excited}`,
            `bunjoure !! 👋${e.business} fun faqt !! der can be a snowstorme wit thunder ! it is knowne as thundersnowe !! ${e.coolwoah}`,
            `hOlaA !! 👋${e.silly} go wach da nortenr lites !! ${e.excited} dey ar best seen in da winter ! ${e.nerd}`
        ]
    },
    {
        day: 1,
        month: 11,
        messages: [
            `hai !! 👋${e.happy} i'm bakke!!! ${e.happy}${e.shock_handless.e} waching da leavs fal onto da gruond as autumne continueses ${e.whistling}`,
            `heye !! 👋${e.happy} how ar yu?? ${e.sad} da tree nexte to me just loste a leaf !! ${e.sad2.e} and its COLDE !!! ${e.glad} but im fien !`,
            `👋${e.happy} gogogo bugoro !! ${e.silly} jus kiding !! hav a gud autmune!! ${e.angel}`,
            `halo !! 👋${e.happy} an angele was broughte upon me !! ${e.shock_handless.e}${e.angel} he told me to wish yu gud luck in da beutiful autumnene !!! ${e.happy}`,
            `ahoj !!! 👋${e.happy} da tieds ar calm but da tempreturs ar lo !!! ${e.whistling}`,
            `boogi !! ${e.tribaldance} ${e.angry_pink.e} its reining agein !!! frinq da cloudese !!!`
        ]
    },
    {
        day: 15,
        month: 12,
        messages: [
            `${e.sad2.e} im freezinge !!! enywey, helo, sir ! 👋${e.business}`,
            `hai !! 👋${e.happy} i bet yu yur such a gud smily dat santa wil gift yu yur favrit toy !!! ${e.excited}`,
            `snowflaks fal on top of me as da cold winds hit me in da cheekse ! itse wintere isnte it... 👋${e.sad2.e}`,
            `👋${e.happy} ar yu a gud smilye ? ${e.think} santa only givs gud smilies giftse !! ${e.stare} i hop yu wer a gud smily !`,
            `i wish yu a meri chrismas, i wish yu a meri chrismas, i WISHE yu a meri chrismas and a hapie new yeare !!! ${e.whistling} ${e.excited}`,
            `👋${e.sad} fields of gras hav becom patches of leavs upon leavs and dede plantse !! ${e.sad2.e} at lest som trees stil hold deir leevs up ${e.happy}`,
            `👋${e.silly} i thro snobal to gret yu !!`
        ]
    }
];

export = {
    bot_ready_answers: bot_ready_answers,
    non_seasonal_br_answers: non_seasonal_br_answers,
    get_bot_ready_answer: () : string => {
        if (Math.random() > 0.5) return non_seasonal_br_answers[Math.floor(Math.random() * non_seasonal_br_answers.length)];
        const rn = new Date();
        const ans = [...bot_ready_answers].reverse();
        function get_answer_for_date(d: Date) {
            return ans.filter(v => d.getMonth() >= v.month - 1 && (d.getMonth() >= v.month - 1 ? d.getDate() >= v.day : true))[0];
        }
        let a = get_answer_for_date(rn);
        if (!a) {
            rn.setMonth(11, 31);
            a = get_answer_for_date(rn);
        }
        return a.messages[Math.floor(Math.random() * a.messages.length)];
    },
    eightball_answers: [
        `absolutlie, of cuors!! ${e.happy}`, `noe.. not at alle.. ${e.sad}`,
        `honestlie... ${e.angel} i hav no ideae ${e.sad}`,
        `dat's obviouslie a noe ${e.sad}`,
        `i thinke soe.. ${e.think}`,
        `i dont think soe ${e.sad}`, `obviouslie ${e.glad}`,
        `i'm not suar ${e.think}`,
        `hard to answere ${e.sad2.e}`,
        `i'm 100% certaine, yese!! ${e.excited}`,
        `how am i supoesd to giv an anser to dat ${e.think}`,
        `maybi!! ${e.glad}`, `wat da hekke? NOE!! ${e.angry_pink.e}`,
        `dis question doesnt maek sens ${e.think}`,
        `maybi ${e.think}`, `noe.. ${e.sad}`,
        `i dont wana tel yu ${e.silly}`,
        `of cuors!! ${e.happy}`, `yeahe ${e.glad}`,
        `i dubt it ${e.sad}`,
        `da rng says yese! ${e.glad}`
    ],
    pick_answers: [
        `${e.think} i picke {i}! ${e.happy}`,
        `${e.think} i choos {i}! ${e.happy}`,
        `${e.angel} honestlie... i prefere {i}! ${e.think}`,
        `${e.happy} i think {i} is de best wan`,
        `${e.think} my gut tels me to goe wit {i}!!`,
        `after som hevi thinking... ${e.think} i gues i choos {i}!!`,
        `my opinion might be biased but {i} is de best wan!! ${e.business}`,
        `ar yu dum?? ${e.silly} cant yu alredi see dat {i} is de onli gud wan?? ${e.sad}`,
        `${e.sad} i dont liek eny option but i gues {i} is de best wan`,
        `${e.really} ar yu chalenging me?? whu wuldnte pick {i}???`,
        `${e.funny} {i} is de funiest wan !!`,
        `${e.whistling} i'v polld de entiriti of smililand and results point towardse {i} !!`,
        `${e.party} {i} sounds great !!`,
        `${e.mad} waht de frinq ar thos optionse ??? i gues i'l go wit {i} ${e.sad}`,
        `${e.read} my bloodlien has alweys chosene {i}!`,
        `${e.shock_handless.e} yu scareded me wit yur spooki opteions !! {i} lookse goode ${e.tongue_down.e}`
    ],
    permission_denied_answers: [
        `${e.sad2.e} i dont wana!!`,
        `noe!! ${e.sad}`,
        `NOE!! ${e.angry_pink.e}`,
        `my ownere told me not to ${e.stare}`,
        `i cant do dat ${e.sad}`,
        `let me sleepe!! ${e.sleep}`,
        `i wil onli doe wat i want to. and dat is not on da list. ${e.angry_pink.e}`,
        `its very harde to execut dat comande ${e.clenched_teeth_angry.e}`,
        `let me checke.. ${e.read} yu arn't alowd to do dat!! ${e.clenched_teeth_angry.e}`,
        `leev me aloen ${e.disgust}`,
        `i wana ski!! ${e.ski}`,
        `if yu trie to do dat againe i wil lik yur eyes!! ${e.mad}${e.tongue_down.e}`,
        `go lik yur feet ${e.tongue_left.e}🦶`,
        `do yu reali think yu can do dat ${e.think}`,
        `i'm not gona do dat.. ${e.sad}`,
        `stop disturbinge me ${e.sad}`,
        `i'm reeding!! cant yu see!! ${e.read}`,
        `yu'r not mi owner! ${e.angry_pink.e}`,
        `yu dont get to decied wat i do ${e.disgust}`,
        `i'm at a partie! ${e.party} can't do yur comande! ${e.silly}${e.whistling}`,
        `i'm gona hamer yur hed for being so anoyinge ${e.hammering}${e.sad}`,
        `helo !! yu waned to do dis comande riet ?? wel ${e.silly} too bad i dont wana doe it ${e.funny}`,
        `${e.mad} i told yu not to !!`,
        `${e.oops} i acidentali aet da comand, so i cant doe it ${e.sad}`,
        `if i doo dis comand, yu'r gona die in a tragik car acident !! ${e.sad}`,
        `yese!! ${e.happy} i'm gona do dat comand... ${e.happy} wehnever yu get premisions yu garragabuga ${e.mad}`,
        `i acidentali died so i cant do da comand ${e.sad}${e.silly}`,
        `ask da oogi boogi gods ${e.angel}${e.tribaldance}`,
        `why do yu even trie ${e.sad3.e} im disapointed at yu !!1!`,
        `i am buzy !! ${e.hammering}`,
        `chek yur rols ${e.really}`,
        `i wil do it wans 1+1 = 3 !! ${e.stare}`,
        `stop tryin ${e.please}`,
        `busi listening to my bot frends ${e.whistling}`,
        `go do somthin moar productiv dan bothering me ${e.tongue_left.e}`,
        `i dont feel liek doing dat comeand righte nowe honestli ${e.think}`,
        `ar yu proud of yurself for anoying me?? ${e.angry_pink.e}`,
        `${e.stare} cant execut this comand withuot inspecting yu !! ${e.read}`,
        `meybi wans yur alowd to do dis comand yu can com bak and execut it ${e.really}`,
        `im out of ideas !! just stope !! ${e.sad3.e} yur meking me sade...`
    ]
}