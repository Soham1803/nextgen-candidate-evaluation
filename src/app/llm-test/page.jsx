'use client'

import { useChat } from "ai/react"
import { useRef, useEffect } from 'react'

export default function RagChat(){
    const { messages, input, handleInputChange, handleSubmit } = useChat({
        api: 'api/llm',
        onError: (e) => {
            console.log(e)
        }
    });
    const chatParent = useRef(null)

    useEffect(() => {
        const domNode = chatParent.current
        if (domNode) {
            domNode.scrollTop = domNode.scrollHeight
        }
    })

    return (
        <main className="flex flex-col w-[80vw] h-[90vh] max-h-dvh rounded-[12px] mt-16 bg-[#a0b7e0] ">

            <section className="p-4">
                <form onSubmit={handleSubmit} className="flex w-full max-w-3xl mx-auto items-center">
                    <input className="flex-1 min-h-[40px] text-lg text-[#929292] px-5 rounded-lg" placeholder="Type your question here..." type="text" value={input} onChange={handleInputChange} />
                    <button className="ml-4 bg-blue-gray-400 rounded-lg px-3 py-1 text-lg text-black" type="submit">
                        Submit
                    </button>
                </form>
            </section>

            <section className="container px-0 pb-10 flex flex-col flex-grow gap-4 mx-auto max-w-5xl">
                <ul ref={chatParent} className="h-1 p-4 flex-grow bg-muted/50 rounded-lg overflow-y-auto flex flex-col gap-4 text-[#5b5b5b]  font-normal">
                    {messages.map((m, index) => (
                        <div key={index}>
                            {m.role === 'user' ? (
                                <li key={m.id} className="flex flex-row">
                                    <div className="rounded-xl p-4 bg-background shadow-md flex bg-blue-gray-100">
                                        <p className="text-lg">{m.content}</p>
                                    </div>
                                </li>
                            ) : (
                                <li key={m.id} className="flex flex-row-reverse">
                                    <div className="rounded-xl p-4 bg-background shadow-md flex w-full">
                                        <p className="text-lg">
                                           {m.content}
                                        </p>
                                    </div>
                                </li>
                            )}
                        </div>
                    ))}
                </ul >
            </section>
        </main>
    )
}