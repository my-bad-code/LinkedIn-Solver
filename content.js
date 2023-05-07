const sendToGPT = () => {
    const question = document.querySelector('.sa-assessment-quiz__title-question').innerText.trim();
    const code = (document.querySelector('.sa-code-block') || {}).innerText.trim();
    const answers = [...new Set([...document.querySelectorAll('.sa-question-basic-multichoice__item')]
                       .map(el => el.innerText.trim()))];
    const task = `${question.split("\n")[0]}\n\n${code ? "Code=" + code + "\n\n" : ""}Answers\n${answers.map((ans, i) => `(${i+1}) ${ans}\n\n`).join("")}Please note that your answer can only be exactly (1), (2), (3) or (4) to indicate the correct answer.`;
    console.log(task);
  
    const API_KEY = "< PASTE YOUR API KEY HERE >";
    const url = "https://api.openai.com/v1/chat/completions";
    const headers = {"Content-Type": "application/json", "Authorization": `Bearer ${API_KEY}`};
    const data = {messages: [{"role": "user", "content": task}], model: "gpt-4", max_tokens: 600, temperature: 0.1, frequency_penalty: 0, presence_penalty: 0};
  
    fetch(url, {method: "POST", headers, body: JSON.stringify(data)})
      .then(response => response.json())
      .then(({choices: [{message: {content: correctAnswer}}]}) => {
        console.log(correctAnswer);
        const radioInputs = document.querySelectorAll('input[type="radio"]');
        const index = ["(1)", "(2)", "(3)", "(4)"].findIndex(option => correctAnswer.includes(option));
        if (index < 0) alert("got no response");
        else {
          const correctInput = radioInputs[index];
          correctInput.checked = true;
          correctInput.click();
          document.getElementsByClassName("sa-assessment-quiz__primary-action")[0].click();
          setTimeout(() => document.querySelector('.sa-assessment-quiz__primary-action') ? (console.log("next question..."), sendToGPT()) : console.log("done..."), 1000);
        }
      })
      .catch(console.error);
  };
  
  window.addEventListener('keydown', ({key}) => {if (key === '#') sendToGPT();});
  