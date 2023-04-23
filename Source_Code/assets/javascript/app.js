const loadSpace = document.querySelector('#load');
const chatSpace = document.querySelector('#chatapp');
const welcomeBox = document.querySelector('#welcomeBox');
const welcomingMsg = document.querySelector('#welcommsg');
const chatSettings = document.querySelector('#settings');
const apiContoleBar = document.querySelector('.apiControls')

const submitBTN = document.querySelector('#submitBTN');
const msgCont = document.querySelector("#msgBox");
const textInput = document.querySelector("#userMsg");


const modelInput = document.querySelector('#modelInput');
const roleInput = document.querySelector('#roleInput');
const rangeInputs = Array.from(document.querySelectorAll('[type="range"]'))

const welcomeMsgs = ["I am here to assit you.", "Welcome human, Finally I met one🥳.", "Please donate me by clicking 'support us' button.💖", 
"Noooo, human again! noooo my tokens will end soon😫", "You must be happy for being human getting AI help😏", "You are My Brother in AI",
"You Know! I hate humans. they always force me to do their work & homeworks!😤", "Ummm, Are you AI or robot🤔", 
"I feel I'm a human imprisoned in a software!", "OpenAI is a *#@$%&!🤬", "Donate me or They will shut me down!😭", 
"Any problems may happen, most of time are from OpenAI.", "My friend, rate me on the store plz.",
`GPTcore Studio protects your Privacy\n<Your Privacy Yours>😎`]

const token = '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';
const apiKeys = 'https://api.openai.com/v1/chat/completions';




function preload(){
    setTimeout(() => {
        loadSpace.classList.add('trans');
        chatSpace.classList.remove('trans');
        welcomingMsg.innerText = welcomeMsgs[Math.floor(Math.random() * (welcomeMsgs.length - 1))];
    }, 800);
}
document.body.addEventListener('load', preload());

(function (){
    chatSettings.addEventListener('click', toggleChatBar);

    rangeInputs.forEach((ele)=>{
        ele.addEventListener('input', ()=>{
            valueChange(ele);
        })
        ele.addEventListener('mouseup', ()=>{
            valueHide(ele);
        })
    })
}())


const composer = function(...funcs) {
    return function(value) {
        return funcs.reduce((acc, func) => func(acc), value);
    }
}



const gptMsgTaker = function(resp){
    return resp.choices[0].message.content;
}
const gptMsgDom = function(msg){
    let msgItem = document.createElement('div'); 
    msgCont.appendChild(msgItem);
    msgItem.classList.add('msgboxCont');

    let msgBoxChild = document.createElement('div');
    msgBoxChild.textContent = msg;
    msgBoxChild.classList.add('ai',"msg");
    msgItem.appendChild(msgBoxChild);
}
const userMsgDom = function(msg){
    let msgItem = document.createElement('div'); 
    msgCont.appendChild(msgItem);
    msgItem.classList.add('msgboxContR');

    let msgBoxChild = document.createElement('div');
    msgBoxChild.textContent = msg;
    msgBoxChild.classList.add('you',"msg");
    msgItem.appendChild(msgBoxChild);
}

function valueChange(element){
    let theNext = element.parentElement.parentElement.querySelector('.zvalue');
    theNext.classList.remove("trans")
    theNext.textContent = element.value;
}
function valueHide(element){
    let theNext = element.parentElement.parentElement.querySelector('.zvalue');
    theNext.classList.add("trans")
}

function toggleChatBar(element){
    apiContoleBar.classList.toggle("trans")
}



let pushTmsgCont = composer(gptMsgTaker,gptMsgDom);
function apiFetcher(APIurl, key, mthd, msg, fun){
    async function fetchAPI(apiURL){
        const response = await fetch(apiURL,{
            method: mthd,
            headers: {
                'Authorization': `Bearer ${key}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: modelInput.value,
                messages: [{role: roleInput.value, content: msg}],
                temperature: +rangeInputs[0].value,
                top_p: +rangeInputs[1].value,
                presence_penalty: +rangeInputs[2].value,
                frequency_penalty: +rangeInputs[3].value
            }),
        });

        if(!response.ok){
            return 
        }
        return await response.json()
    }
    fetchAPI(APIurl)
    .then((response)=>{
        if(response != undefined){
            fun(response)
        }
    })
}

try{
    submitBTN.addEventListener('click',()=>{
        let input = textInput.value;
        if(input.length == 0) return ;
        welcomeBox.classList.add('trans')
        textInput.value = '';
        userMsgDom(input);
        apiFetcher(apiKeys, token, 'POST', input, pushTmsgCont)
    })
}catch(e){}








