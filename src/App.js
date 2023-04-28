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

function onSubmit(e, num1, num2, oper, setResp) {
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
	const [oper, setOper] = useState("+");
	return (
		<div className="Main">
			<Form onSubmit={(e) => onSubmit(e, num1, num2, oper, setResp)}>
				<Form.Group>
					<Form.Label>Введите первое число: </Form.Label>
					<Form.Control
						defaultValue={num1}
						maxlength="617"
						onChange={(e) => setNum1(e.target.value)}
					/>
				</Form.Group>
				<Form.Group>
					<Form.Label>Введите второе число: </Form.Label>
					<Form.Control
						defaultValue={num2}
						maxlength="617"
						onChange={(e) => setNum2(e.target.value)}
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
		</div>
	);
}

export default App;
