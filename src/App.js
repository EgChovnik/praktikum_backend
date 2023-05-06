import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Form from "react-bootstrap/Form";
import MathJax from "better-react-mathjax/MathJax";
import { format } from "date-fns";
import { useState, useRef } from "react";
import "./App.css";

function App() {
	return (
		<div className="App">
			<MyForm />
		</div>
	);
}

function maxString() {
	let res = "";
	for (let i = 0; i < 617; i++) {
		res += "9";
	}
	return res;
}

function MyForm() {
	const [resp, setResp] = useState("");
	const [num1, setNum1] = useState("0");
	const [num2, setNum2] = useState("0");
	const [mod, setMod] = useState("1");
	const [oper, setOper] = useState("+");
	const ref1 = useRef(null);
	const ref2 = useRef(null);
	const ref3 = useRef(null);

	function onSubmit(e) {
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

	return (
		<>
			<Form onSubmit={(e) => onSubmit(e)}>
				<Form.Group>
					<Form.Label>
						Число <MathJax inline="true">{"\\(x\\)"}</MathJax>:
					</Form.Label>
					<Form.Control
						ref={ref1}
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
					<Button
						variant="outline-dark"
						onClick={(e) => {
							ref1.current.value = maxString();
							setNum1(ref1.current.value);
						}}
					>
						max
					</Button>
				</Form.Group>
				<Form.Group>
					<Form.Label>
						Число <MathJax inline="true">{"\\(y\\)"}</MathJax>:
					</Form.Label>
					<Form.Control
						ref={ref2}
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
					<Button
						variant="outline-dark"
						onClick={(e) => {
							ref2.current.value = maxString();
							setNum2(ref2.current.value);
						}}
					>
						max
					</Button>
				</Form.Group>
				<Form.Group>
					<Form.Label>
						Модуль <MathJax inline="true">{"\\(m\\)"}</MathJax>:
					</Form.Label>
					<Form.Control
						ref={ref3}
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
					<Button
						variant="outline-dark"
						onClick={(e) => {
							ref3.current.value = maxString();
							setMod(ref3.current.value);
						}}
					>
						max
					</Button>
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
						<Button
							variant="outline-dark"
							onClick={(e) => {
								setOper("^");
							}}
							type="submit"
						>
							<MathJax>{"\\((x^y)\\%m\\)"}</MathJax>
						</Button>
						<Button
							variant="outline-dark"
							onClick={(e) => {
								setOper("f");
							}}
							type="submit"
						>
							<MathJax>{"\\(factor(x)\\)"}</MathJax>
						</Button>
						<Button
							variant="outline-dark"
							onClick={(e) => {
								setOper("phi");
							}}
							type="submit"
						>
							<MathJax>{"\\(\\phi(x)\\)"}</MathJax>
						</Button>
					</ButtonGroup>
				</Form.Group>
			</Form>
			{resp !== "" && (
				<p>
					Результат вычисления
					<Form.Text> ({format(Date.now(), "H:mm:ssa")})</Form.Text>
					:
					<br />
					{resp}
				</p>
			)}
		</>
	);
}

export default App;
