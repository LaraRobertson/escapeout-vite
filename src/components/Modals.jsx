import {createPortal} from "react-dom";
import Modal from "react-modal";
import React, {useContext} from "react";
import {Button, Heading, Image, View} from "@aws-amplify/ui-react";
import {MyGameContext, MyAuthContext} from "../MyContext";
import "../assets/modal-v1.css";
import Close from "../assets/times-solid-svgrepo-com.svg";

/*
for ModalClue and ModalPuzzle:
https://dev.to/codebucks/how-to-create-an-efficient-modal-component-in-react-using-hooks-and-portals-360p
*/

export function ModalPuzzle({modalPuzzleContent,setModalPuzzleContent,children}) {
        const { isChecked } = useContext(MyGameContext);
        function close() {
            setModalPuzzleContent({show:false,content:""});
        }
        return (
            <>
                {createPortal(
                    <div
                        className={`modalContainer ${modalPuzzleContent.show ? "showModal" : ""} `}
                        onClick={() => close()}
                    >
                        <div className="modal dark from-right" onClick={(e) => e.stopPropagation()}>
                            <header className="modal_header">
                                <h2 className="modal_header-clueDetails">Puzzle</h2>
                                <button className="close" onClick={() => close()}>
                                    <img src={Close} alt="close" />
                                </button>
                            </header>
                            <main className="modal_content">
                                <View className={isChecked? "dark" : "light"}>
                                    {children}
                                </View>
                            </main>
                            <footer className="modal_footer">
                                <button className="modal-close" onClick={() => close()}>
                                    Close
                                </button>
                            </footer>
                        </div>
                    </div>,
                    document.getElementById("modal")
                )}
            </>
        )
    }

export function ModalClue({modalClueContent,setModalClueContent,clueDetails,setCluesFunction,children}) {
    const { isChecked } = useContext(MyGameContext);
    function close() {
        setModalClueContent({show:false,content:""});
    }
    return (
        <>
        {createPortal(
            <div
                className={`modalContainer ${modalClueContent.show ? "showModal" : ""} `}
                onClick={() => close()}
            >
                <div className="modal dark from-left" onClick={(e) => e.stopPropagation()}>
                    <header className="modal_header">
                        <h2 className="modal_header-clueDetails">Clue</h2>
                        <button className="close" onClick={() => close()}>
                            <img src={Close} alt="close" />
                        </button>
                    </header>
                    <main className="modal_content">
                        <View className={isChecked? "dark" : "light"}>
                            {children}
                        </View>
                    </main>
                    <footer className="modal_footer">
                        <button className="submit" onClick={()=>setCluesFunction("<strong>CLUE</strong> ==> " +
                            clueDetails.gameClueText + " <br />")}>add clue to notes</button>
                        <button className="modal-close" onClick={() => close()}>
                            Close
                        </button>
                    </footer>
                </div>
            </div>,
            document.getElementById("modal")
        )}
        </>
    )
}

export function ReactModal({modalContent,children}) {
    console.log("ReactModal");
    let mapClass="";
    if (modalContent.content === "Map") mapClass="-Map";
    const { setModalContent } = useContext(MyAuthContext);
    Modal.setAppElement("#modal");
    function closeModal() {
        setModalContent({open:false,content:""});
    }
    return (
        <>
        {createPortal(<Modal
                closeTimeoutMS={200}
                isOpen={modalContent.open}
                onRequestClose={closeModal}
                className={"modalContent" + mapClass}
                contentLabel={"General"}
                overlayClassName={"slide-from-top"}
                parentSelector={() => document.querySelector("#modal")}
                preventScroll={
                    false
                    /* Boolean indicating if the modal should use the preventScroll flag when
                       restoring focus to the element that had focus prior to its display. */}
            >
                <View className={"modal-top-bar"}>
                    <Heading level={4} marginBottom="10px" className={"modal-header"}>{modalContent.content}</Heading>
                    <Button className="close-button-modal light"
                            onClick={closeModal}>X</Button>
                </View>
                {children}

                <View className="modal-from-top-close" textAlign={"center"} width={"100%"}>
                    <Button className="close light" onClick={closeModal}>close</Button>
                </View>
            </Modal>,
            document.getElementById("modal")
        )}
        </>
    )
}
export function ReactModalFromBottom({modalContent,children}) {
    console.log("ReactModalFromBottom");
    let mapClass="";
    if (modalContent.content === "Map") mapClass="-Map";
    const { setModalContent } = useContext(MyGameContext);
    Modal.setAppElement("#modal");
    function closeModal() {
        setModalContent({open:false,content:""});
    }
    return (
        <>
            {createPortal(<Modal
                    closeTimeoutMS={200}
                    isOpen={modalContent.open}
                    onRequestClose={closeModal}
                    className={"modalContent" + mapClass}
                    contentLabel={"General"}
                    overlayClassName={"slide-from-bottom"}
                    parentSelector={() => document.querySelector("#modal")}
                    preventScroll={
                        false
                        /* Boolean indicating if the modal should use the preventScroll flag when
                           restoring focus to the element that had focus prior to its display. */}
                >
                    <View className={"modal-top-bar"}>
                        <Heading level={4} marginBottom="10px" className={"modal-header"}>{modalContent.content}</Heading>
                        <Button className="close-button-modal light"
                                onClick={closeModal}>X</Button>
                    </View>
                    {children}

                    <View className="modal-from-top-close" textAlign={"center"} width={"100%"}>
                        <Button className="close light" onClick={closeModal}>close</Button>
                    </View>
                </Modal>,
                document.getElementById("modal")
            )}
        </>
    )
}
export function ReactModalFromRight({children}) {
    console.log("ReactModalFromRight");
    const { modalContent, setModalContent } = useContext(MyAuthContext);
    Modal.setAppElement("#modal");
    function closeModal() {
        setModalContent({open:false,content:""});
    }
    return (
        <>
            {createPortal(<Modal
                    closeTimeoutMS={200}
                    isOpen={modalContent.open}
                    onRequestClose={closeModal}
                    className={"modalContent adminModal"}
                    contentLabel={"General"}
                    overlayClassName={"slide-from-right"}
                    parentSelector={() => document.querySelector("#modal")}
                    preventScroll={
                        false
                        /* Boolean indicating if the modal should use the preventScroll flag when
                           restoring focus to the element that had focus prior to its display. */}
                >
                    <View className={"modal-top-bar"}>
                        <Heading level={4} marginBottom="10px" className={"modal-header"}>{modalContent.content}</Heading>
                        <Button className="close-button-modal light"
                                onClick={closeModal}>X</Button>
                    </View>
                    {children}

                    <View className="modal-from-top-close" textAlign={"center"} width={"100%"}>
                        <Button className="close light" onClick={closeModal}>close</Button>
                    </View>
                </Modal>,
                document.getElementById("modal")
            )}
        </>
    )
}
export function ReactModalWinner({gameTimeTotal,children}) {
    console.log("ReactModalWinner");
    let openModal = false;
    if (gameTimeTotal > 0) openModal = true;
    const { setModalContent } = useContext(MyGameContext);
    Modal.setAppElement("#modal");
    function closeModal() {
        setModalContent({open:false,content:""});
    }
    return (
        <>
            {createPortal(<Modal
                    closeTimeoutMS={200}
                    isOpen={openModal}
                    onRequestClose={closeModal}
                    className={"modalContent"}
                    contentLabel={"General"}
                    overlayClassName={"slide-from-bottom"}
                    parentSelector={() => document.querySelector("#modal")}
                    preventScroll={
                        false
                        /* Boolean indicating if the modal should use the preventScroll flag when
                           restoring focus to the element that had focus prior to its display. */}
                >
                    {children}
                </Modal>,
                document.getElementById("modal")
            )}
        </>
    )
}