const { e } = require("./vars.json");

const non_seasonal_br_answers = [
    `rolle up yur blindes !! ${e.shock_handless.e} im waching yu !! ${e.silly.e}`,
    `helololo !!! ${e.silly.e}${e.whistling.e} googo baba googo qug !! graga bogo grono boo !! gigi gogo gaga goo !!! grege gogo bugo qoo !!`,
    `pleased to meet yu mr / ms smily !! ${e.business.e} i hop yu hav a gud dey tudey !!! ${e.happy.e}`,
    `привет !!!! ${e.business.e} i am multilinguelale man !! ${e.nerd.e}`,
    `i'm bakke!!! ${e.happy.e}`,
    `toki !! 👋${e.excited.e} mi pona e pona sina!!!`,
    `lötló !!! ${e.silly.e}`
];
const bot_ready_answers = [
    {
        day: 1,
        month: 11,
        messages: [
            `hai !! 👋${e.happy.e} i'm bakke!!! ${e.happy.e}${e.shock_handless.e} waching da leavs fal onto da gruond as autumne continueses ${e.whistling.e}`,
            `heye !! 👋${e.happy.e} how ar yu?? ${e.sad.e} da tree nexte to me just loste a leaf !! ${e.sad2.e} and its COLDE !!! ${e.glad.e} but im fien !`,
            `👋${e.happy.e} gogogo bugoro !! ${e.silly.e} jus kiding !! hav a gud autmune!! ${e.angel.e}`,
            `halo !! 👋${e.happy.e} an angele was broughte upon me !! ${e.shock_handless.e}${e.angel.e} he told me to wish yu gud luck in da beutiful autumnene !!! ${e.happy.e}`,
            `ahoj !!! 👋${e.happy.e} da tieds ar calm but da tempreturs ar lo !!! ${e.whistling.e}`,
            `boogi !! ${e.tribaldance.e} ${e.angry_pink.e} its reining agein !!! frinq da cloudese !!!`
        ]
    },
    {
        day: 15,
        month: 12,
        messages: [
            `${e.sad2.e} im freezinge !!! enywey, helo, sir ! 👋${e.business.e}`,
            `hai !! 👋${e.happy.e} i bet yu yur such a gud smily dat santa wil gift yu yur favrit toy !!! ${e.excited.e}`,
            `snowflaks fal on top of me as da cold winds hit me in da cheekse ! itse wintere isnte it... 👋${e.sad2.e}`,
            `👋${e.happy.e} ar yu a gud smilye ? ${e.think.e} santa only givs gud smilies giftse !! ${e.stare.e} i hop yu wer a gud smily !`,
            `i wish yu a meri chrismas, i wish yu a meri chrismas, i WISHE yu a meri chrismas and a hapie new yeare !!! ${e.whistling.e} ${e.excited.e}`,
            `👋${e.sad.e} fields of gras hav becom patches of leavs upon leavs and dede plantse !! ${e.sad2.e} at lest som trees stil hold deir leevs up ${e.happy.e}`,
            `👋${e.silly.e} i thro snobal to gret yu !!`
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
        `absolutlie, of cuors!! ${e.happy.e}`, `noe.. not at alle.. ${e.sad.e}`,
        `honestlie... ${e.angel.e} i hav no ideae ${e.sad.e}`,
        `dat's obviouslie a noe ${e.sad.e}`,
        `i thinke soe.. ${e.think.e}`,
        `i dont think soe ${e.sad.e}`, `obviouslie ${e.glad.e}`,
        `i'm not suar ${e.think.e}`,
        `hard to answere ${e.sad2.e}`,
        `i'm 100% certaine, yese!! ${e.excited.e}`,
        `how am i supoesd to giv an anser to dat ${e.think.e}`,
        `maybi!! ${e.glad.e}`, `wat da hekke? NOE!! ${e.angry_pink.e}`,
        `dis question doesnt maek sens ${e.think.e}`,
        `maybi ${e.think.e}`, `noe.. ${e.sad.e}`,
        `i dont wana tel yu ${e.silly.e}`,
        `of cuors!! ${e.happy.e}`, `yeahe ${e.glad.e}`,
        `i dubt it ${e.sad.e}`,
        `da rng says yese! ${e.glad.e}`
    ],
    pick_answers: [
        `${e.think.e} i picke {i}! ${e.happy.e}`,
        `${e.think.e} i choos {i}! ${e.happy.e}`,
        `${e.angel.e} honestlie... i prefere {i}! ${e.think.e}`,
        `${e.happy.e} i think {i} is de best wan`,
        `${e.think.e} my gut tels me to goe wit {i}!!`,
        `after som hevi thinking... ${e.think.e} i gues i choos {i}!!`,
        `my opinion might be biased but {i} is de best wan!! ${e.business.e}`,
        `ar yu dum?? ${e.silly.e} cant yu alredi see dat {i} is de onli gud wan?? ${e.sad.e}`,
        `${e.sad.e} i dont liek eny option but i gues {i} is de best wan`,
        `${e.really.e} ar yu chalenging me?? whu wuldnte pick {i}???`,
        `${e.funny.e} {i} is de funiest wan !!`,
        `${e.whistling.e} i'v polld de entiriti of smililand and results point towardse {i} !!`,
        `${e.party.e} {i} sounds great !!`,
        `${e.mad.e} waht de frinq ar thos optionse ??? i gues i'l go wit {i} ${e.sad.e}`,
        `${e.read.e} my bloodlien has alweys chosene {i}!`,
        `${e.shock_handless.e} yu scareded me wit yur spooki opteions !! {i} lookse goode ${e.tongue_down.e}`
    ],
    permission_denied_answers: [
        `${e.sad2.e} i dont wana!!`,
        `noe!! ${e.sad.e}`,
        `NOE!! ${e.angry_pink.e}`,
        `my ownere told me not to ${e.stare.e}`,
        `i cant do dat ${e.sad.e}`,
        `let me sleepe!! ${e.sleep.e}`,
        `i wil onli doe wat i want to. and dat is not on da list. ${e.angry_pink.e}`,
        `its very harde to execut dat comande ${e.clenched_teeth_angry.e}`,
        `let me checke.. ${e.read.e} yu arn't alowd to do dat!! ${e.clenched_teeth_angry.e}`,
        `leev me aloen ${e.disgust.e}`,
        `i wana ski!! ${e.ski.e}`,
        `if yu trie to do dat againe i wil lik yur eyes!! ${e.mad.e}${e.tongue_down.e}`,
        `go lik yur feet ${e.tongue_left.e}🦶`,
        `do yu reali think yu can do dat ${e.think.e}`,
        `i'm not gona do dat.. ${e.sad.e}`,
        `stop disturbinge me ${e.sad.e}`,
        `i'm reeding!! cant yu see!! ${e.read.e}`,
        `yu'r not mi owner! ${e.angry_pink.e}`,
        `yu dont get to decied wat i do ${e.disgust.e}`,
        `i'm at a partie! ${e.party.e} can't do yur comande! ${e.silly.e}${e.whistling.e}`,
        `i'm gona hamer yur hed for being so anoyinge ${e.hammering.e}${e.sad.e}`,
        `helo !! yu waned to do dis comande riet ?? wel ${e.silly.e} too bad i dont wana doe it ${e.funny.e}`,
        `${e.mad.e} i told yu not to !!`,
        `${e.oops.e} i acidentali aet da comand, so i cant doe it ${e.sad.e}`,
        `if i doo dis comand, yu'r gona die in a tragik car acident !! ${e.sad.e}`,
        `yese!! ${e.happy.e} i'm gona do dat comand... ${e.happy.e} wehnever yu get premisions yu garragabuga ${e.mad.e}`,
        `i acidentali died so i cant do da comand ${e.sad.e}${e.silly.e}`,
        `ask da oogi boogi gods ${e.angel.e}${e.tribaldance.e}`,
        `why do yu even trie ${e.sad3.e} im disapointed at yu !!1!`,
        `i am buzy !! ${e.hammering.e}`,
        `chek yur rols ${e.really.e}`,
        `i wil do it wans 1+1 = 3 !! ${e.stare.e}`,
        `stop tryin ${e.please.e}`,
        `busi listening to my bot frends ${e.whistling.e}`,
        `go do somthin moar productiv dan bothering me ${e.tongue_left.e}`,
        `i dont feel liek doing dat comeand righte nowe honestli ${e.think.e}`,
        `ar yu proud of yurself for anoying me?? ${e.angry_pink.e}`,
        `${e.stare.e} cant execut this comand withuot inspecting yu !! ${e.read.e}`,
        `meybi wans yur alowd to do dis comand yu can com bak and execut it ${e.really.e}`,
        `im out of ideas !! just stope !! ${e.sad3.e} yur meking me sade...`
    ]
}