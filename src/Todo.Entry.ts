import { HtmlBuilder } from './Util.HtmlBuilder';
import { TodoStyles as Styles } from './Todo.Styles';
import { Model } from './Model';

export namespace TodoEntry {
    interface StringConstructor {
        format: (formatString: string, ...replacement: any[]) => string;
    }
    export function initializeClient() {
        const head = HtmlBuilder.assignToElement(document.head, {
            attributes: {
                innerHTML: `
                    ${document.head.innerHTML}
                    <title>Todo App Original</title>
                    <meta name="mobile-web-app-capable" content="yes" />
                    <meta name="viewport" content="height=device-height,width=device-width,initial-scale=1,user-scalable=no" />
                `,
            },
        });
        const body = HtmlBuilder.assignToElement(document.body, {
            style: {
                fontSize: 20,
            },
        });
    
        const appContainer = HtmlBuilder.createChild(body, {
            type: "div",
            style: {
                ...Styles.centered,
            }
        });

        // 🏭 Where the magic happens
        {
            // whatever changes is listed as a member of the state
            let model = new Model<CounterState>({
                inputFieldValue: "",
                listOfTodos: []
            });

            const formContainer = HtmlBuilder.createChild(appContainer, {
                type: "div",
                style: {
                    display: "flex"
                }
            });

            const addNewInputField = HtmlBuilder.createChild(formContainer, {
                type: "input",
                attributes: {
                    id: "addNewInputField",
                    placeholder: "Enter Todo description",
                    onchange: () => {
                        let addNewInputField = (<HTMLInputElement>document.getElementById("addNewInputField")).value;
                        model.mutate({ inputFieldValue: addNewInputField })
                    },
                }
            });

            const addButton = HtmlBuilder.createChild(formContainer, {
                type: "div",
                style: {
                    ...Styles.button,
                    fontSize: 24,
                    width: "fit-content",
                    height: "fit-content"
                },
                attributes: {
                    onclick: () => {
                            // model.state.clickCounter += 1 mutates the state prematurely!
                            console.log(model.state.inputFieldValue)
                            let listOfTodosCopy = [...model.state.listOfTodos]
                            listOfTodosCopy.push(model.state.inputFieldValue)
                            model.mutate({ listOfTodos: listOfTodosCopy});
                            (<HTMLInputElement>document.getElementById("addNewInputField")).value = ""
                        },
                    innerHTML: "Add"
                }
            });

            const taskListBox = HtmlBuilder.createChild(appContainer, {
                type: "div",
            });

            // model.listen doesn't fire when the state mutates prematurely
            model.listen(["listOfTodos"], state => {
                console.log(model.state.listOfTodos)
                const newTodo = HtmlBuilder.createChild(taskListBox, {
                    type: "div",
                    style: {
                        padding: "8px",
                        backgroundColor: "lightblue"
                    },
                    attributes: {
                        innerHTML: state.inputFieldValue
                    }
                });
            });
        }
    }

    type CounterState = {
        inputFieldValue: string,
        listOfTodos: Array<string>
    };
}

// 👇 Client entry point
TodoEntry.initializeClient();