var key;

fetch('token')
.then(response => response.text())
.then(text => {
    key = text;
})

const url = 'https://api-inference.huggingface.co/models/';
const model = 'facebook/blenderbot-400M-distill';

const text = document.getElementById('textInput');
const send = document.getElementById('sendInput');
const main = document.querySelector('main');


function createMessage(from, textContent) {
    const message = document.createElement('section');
    const picture = document.createElement('div');
    const bubble = document.createElement('section');
    const text = document.createElement('p');
    const time = document.createElement('p');

    message.className = 'message from-' + from;
    picture.className = 'picture';
    bubble.className = 'bubble';
    text.className = 'text';
    time.className = 'time';

    text.innerText = textContent;
    const today = new Date(); 
    time.innerText = `${today.getHours()}:${today.getMinutes()}`;

    bubble.appendChild(text);
    bubble.appendChild(time);
    message.appendChild(picture);
    message.appendChild(bubble);

    return message;
}

text.addEventListener('keypress', (e) => {
    if(e.key === "Enter") {
        e.preventDefault();
        send.click();
    }
});

send.addEventListener('click', (e) => {
    e.preventDefault();
    
    if(text.value != '') {
        const sentText = text.value;
        text.value = '';

        sentMessage = createMessage('me', sentText);
        main.appendChild(sentMessage);
        main.scrollTo({top: main.scrollHeight, behavior: 'smooth'});

        fetch(url+model, {
            method: 'POST',
            headers: { 'Authorization': 'Bearer '+key },
            body: JSON.stringify(
                {
                    'inputs': {
                        'text': sentText
                    }
                }
            )
        })
        .then((response) => response.json())
        .then((data) => {
            console.log(JSON.stringify(data));

            receivedMessage = createMessage('them', data.generated_text);
            main.appendChild(receivedMessage);
            main.scrollTo({top: main.scrollHeight, behavior: 'smooth'});
        })
        
    }
});

