import { HtmlBuilder } from './Util.HtmlBuilder';
import { VideoTimerStyles as Styles } from './VideoTimer.Styles';
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
                gridArea: "a",
                ...Styles.centered,
                gridTemplateRows: "auto 3em auto",
                gridTemplateAreas: `
                    "p"
                    "t"
                    "g"
                `,
            }
        });

        // 🏭 Where the magic happens
        {
            // whatever changes is listed as part of the state
            let model = new Model<CounterState>({
                clickCounter: 0
            });

            const numberBox = HtmlBuilder.createChild(appContainer, {
                type: "div",
                attributes: {
                    innerHTML: '0'
                }
            });

            const button = HtmlBuilder.createChild(appContainer, {
                type: "button",
                attributes: {
                    onclick: () => {
                            let incremented = model.state.clickCounter + 1 // model.state.clickCounter += 1 mutates the state prematurely!
                            // console.log(incremented)
                            model.mutate({clickCounter: incremented})
                        },
                    innerHTML: "Click Me"
                }
            });

            // model.listen doesn't fire when the state mutates prematurely
            model.listen(["clickCounter"], state => {
                console.log('model.listen has fired')
                let countCopy = state.clickCounter
                numberBox.innerHTML = `${countCopy}`
            });
        }
    }

    type CounterState = {
        clickCounter: number
    };
}

// 👇 Client entry point
TodoEntry.initializeClient();