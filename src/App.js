import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Form from "react-bootstrap/Form";
import MathJax from "better-react-mathjax/MathJax";
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
					<Form.Label>
						Число <MathJax inline="true">{"\\(x\\)"}</MathJax>:
					</Form.Label>
					<Form.Control
						as="textarea"
						rows={1}
						defaultValue={num1}
						maxLength="617"
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
					<Form.Label>
						Число <MathJax inline="true">{"\\(y\\)"}</MathJax>:
					</Form.Label>
					<Form.Control
						as="textarea"
						rows={1}
						defaultValue={num2}
						maxLength="617"
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
					<Form.Label>
						Модуль <MathJax inline="true">{"\\(m\\)"}</MathJax>:
					</Form.Label>
					<Form.Control
						as="textarea"
						rows={1}
						defaultValue={mod}
						maxLength="617"
						onChange={(e) => {
							e.target.value = e.target.value.replace(
								/^[0]/g,
								""
							);
							e.target.value = e.target.value.replace(
								/[^0-9]/g,
								""
							);
							setMod(e.target.value);
						}}
					/>
				</Form.Group>
				<Form.Group>
					<Form.Text>
						Примечание: все числа должны иметь не больше 617-ти
						разрядов
					</Form.Text>
				</Form.Group>
				<Form.Group>
					<ButtonGroup>
						<Button
							variant="outline-dark"
							type="submit"
							onClick={(e) => {
								setOper("+");
							}}
						>
							<MathJax>{"\\((x+y)\\%m\\)"}</MathJax>
						</Button>
						<Button
							variant="outline-dark"
							onClick={(e) => {
								setOper("-");
							}}
							type="submit"
						>
							<MathJax>{"\\((x-y)\\%m\\)"}</MathJax>
						</Button>
						<Button
							variant="outline-dark"
							onClick={(e) => {
								setOper("*");
							}}
							type="submit"
						>
							<MathJax>{"\\((x*y)\\%m\\)"}</MathJax>
						</Button>
						<Button
							variant="outline-dark"
							onClick={(e) => {
								setOper("/");
							}}
							type="submit"
						>
							<MathJax>{"\\((x/y)\\%m\\)"}</MathJax>
						</Button>
					</ButtonGroup>
				</Form.Group>
			</Form>
			{resp !== "" && <p>Результат вычисления: {resp}</p>}
		</>
	);
}

export default App;
