import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useState } from "react";
import "./App.css";

function App() {
    return (
        <div className="App">
            <MyForm />
        </div>
    );
}

function onSubmit(e, num1, num2, mod, oper, setResp) {
    console.log(num1);
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
            mod: mod,
            oper: oper,
        }),
    })
        .then((resp) => resp.json())
        .then((resp) => setResp(resp["message"]))
        .catch((error) => console.error(error));
}

function MyForm() {
    const [resp, setResp] = useState("");
    const [num1, setNum1] = useState("0");
    const [num2, setNum2] = useState("0");
    const [mod, setMod] = useState("1");
    const [oper, setOper] = useState("+");
    return (
        <>
            <Form onSubmit={(e) => onSubmit(e, num1, num2, mod, oper, setResp)}>
                <Form.Group>
                    <Form.Label>Введите первое число: </Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={1}
                        defaultValue={num1}
                        maxlength="617"
                        onChange={(e) => {
                            e.target.value = e.target.value.replace(
                                /[^0-9-]/g,
                                ""
                            );
                            e.target.value = e.target.value.replace(
                                /^(-)|-+/g,
                                "$1"
                            );
                            setNum1(e.target.value);
                        }}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Введите второе число: </Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={1}
                        defaultValue={num2}
                        maxlength="617"
                        onChange={(e) => {
                            e.target.value = e.target.value.replace(
                                /[^0-9-]/g,
                                ""
                            );
                            e.target.value = e.target.value.replace(
                                /^(-)|-+/g,
                                "$1"
                            );
                            setNum2(e.target.value);
                        }}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Введите модуль: </Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={1}
                        defaultValue={mod}
                        maxlength="617"
                        onChange={(e) => {
                            e.target.value = e.target.value.replace(
                                /[^1-9]/g,
                                ""
                            );
                            setMod(e.target.value);
                        }}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Выберите операцию: </Form.Label>
                    <Form.Select
                        value={oper}
                        onChange={(e) => setOper(e.target.value)}
                    >
                        <option selected>+</option>
                        <option>-</option>
                        <option>*</option>
                        <option>/</option>
                    </Form.Select>
                </Form.Group>
                <Form.Group>
                    <Button variant="primary" type="submit">
                        Вычислить
                    </Button>
                </Form.Group>
                <Form.Group>
                    <Form.Text className="text-muted">
                        Примечание: числа должны иметь не больше 617-ти разрядов
                    </Form.Text>
                </Form.Group>
            </Form>
            {resp !== "" && <p>Результат вычисления: {resp}</p>}
        </>
    );
}

export default App;
