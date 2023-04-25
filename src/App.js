import { useState } from "react";

function App() {
    return (
        <div className="App">
            <Form />
        </div>
    );
}

function onSubmit(e, num1, num2, oper, setResp) {
    e.preventDefault();
    fetch("/count", {
        headers: new Headers({
            Accept: "application/json",
            "Content-Type": "application/json",
        }),
        method: "POST",
        body: JSON.stringify({
            num1: num1,
            num2: num2,
            oper: oper,
        }),
    })
        .then((resp) => resp.json())
        .then((resp) => setResp(resp["message"]))
        .catch((error) => console.error(error));
}

function Form() {
    const [resp, setResp] = useState("");
    const [num1, setNum1] = useState("0");
    const [num2, setNum2] = useState("0");
    const [oper, setOper] = useState("+");
    return (
        <>
            <form onSubmit={(e) => onSubmit(e, num1, num2, oper, setResp)}>
                <label>Введите первое число: </label>
                <textarea
                    value={num1}
                    maxlength="1000"
                    onChange={(e) => setNum1(e.target.value)}
                />
                <br />
                <label>Введите второе число: </label>
                <textarea
                    value={num2}
                    maxlength="1000"
                    onChange={(e) => setNum2(e.target.value)}
                />
                <br />
                <label>Выберите операцию: </label>
                <select value={oper} onChange={(e) => setOper(e.target.value)}>
                    <option selected>+</option>
                    <option>-</option>
                    <option>*</option>
                    <option>/</option>
                </select>
                <br />
                <button>Вычислить</button>
            </form>
            {resp != "" && <p>Результат вычисления: {resp}</p>}
        </>
    );
}

export default App;
