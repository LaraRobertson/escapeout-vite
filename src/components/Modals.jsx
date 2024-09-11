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
export function ModalGameIntro({modalContentGI,setModalContentGI, handlePlayGameIntro, children}) {
    const { isChecked } = useContext(MyGameContext);
    function close() {
        setModalContentGI({show:false,content:""});
    }
    return (
        <>
            {createPortal(
                <div
                    className={`modalContainer ${modalContentGI.show ? "showModal" : ""} `}
                    onClick={() => close()}
                >
                    <div className="modal dark from-right" onClick={(e) => e.stopPropagation()}>
                        <header className="modal_header">
                            <h2 className="modal_header-clueDetails">Are You Ready?</h2>
                            <button className="close" onClick={() => close()}>
                                <img src={Close} alt="close" />
                            </button>
                        </header>
                        <main className="modal_content">
                            <View className={"dark"}>
                                {children}
                            </View>
                        </main>
                        <footer className="modal_footer">
                            <Button margin="0 0 0 0" className="button"
                                    onClick={() => {
                                        handlePlayGameIntro();
                                    }}>PLAY - Time Starts</Button>
                        </footer>
                    </div>
                </div>,
                document.getElementById("modal")
            )}
        </>
    )
}

export function ModalExampleGame({modalContentEG,setModalContentEG,setModalContentEG2, children}) {
    const { isChecked } = useContext(MyGameContext);
    function close() {
        setModalContentEG({show:false,content:""});
    }
    return (
        <>
            {createPortal(
                <div
                    className={`modalContainer ${modalContentEG.show ? "showModal" : ""} `}
                    onClick={() => close()}
                >
                    <div className="modal dark from-right" onClick={(e) => e.stopPropagation()}>
                        <header className="modal_header">
                            <h3 className="modal_header-clueDetails">How to Play (1 of 5)</h3>
                            <button className="close" onClick={() => close()}>
                                <img src={Close} alt="close" />
                            </button>
                        </header>
                        <main className="modal_content">
                            <View className={"dark"}>
                                {children}
                            </View>
                        </main>
                        <footer className="modal_footer">
                            <Button margin="0 0 0 0" className="button"
                                    onClick={() => {
                                        close();
                                        setModalContentEG2({
                                            show: true,
                                            content: "Example Game2"
                                        })
                                    }}>Next</Button>
                            <Button margin="0 10px 0 0" className="button"
                                    onClick={() => {
                                        close();
                                    }}>Close</Button>

                        </footer>
                    </div>
                </div>,
                document.getElementById("modal")
            )}
        </>
    )
}

export function ModalExampleGame2({modalContentEG2,setModalContentEG2,setModalContentEG3,setModalContentEG, children}) {
    const { isChecked } = useContext(MyGameContext);
    function close() {
        setModalContentEG2({show:false,content:""});
    }
    return (
        <>
            {createPortal(
                <div
                    className={`modalContainer ${modalContentEG2.show ? "showModal" : ""} `}
                    onClick={() => close()}
                >
                    <div className="modal dark from-right" onClick={(e) => e.stopPropagation()}>
                        <header className="modal_header">
                            <h3 className="modal_header-clueDetails">How to Play (2 of 5)</h3>
                            <button className="close" onClick={() => close()}>
                                <img src={Close} alt="close" />
                            </button>
                        </header>
                        <main className="modal_content">
                            <View className={"dark"}>
                                {children}
                            </View>
                        </main>
                        <footer className="modal_footer">
                            <Button margin="0 0 0 0" className="button"
                                    onClick={() => {
                                        close();
                                        setModalContentEG3({
                                            show: true,
                                            content: "Example Game3"
                                        })
                                    }}>Next</Button>
                            <Button margin="0 10px 0 0" className="button"
                                    onClick={() => {
                                        close();
                                    }}>Close</Button>
                            <Button margin="0 10px 0 0" className="button"
                                    onClick={() => {
                                        close();
                                        setModalContentEG({
                                            show: true,
                                            content: "Example Game"
                                        })
                                    }}>Back</Button>

                        </footer>
                    </div>
                </div>,
                document.getElementById("modal")
            )}
        </>
    )
}
export function ModalExampleGame3({modalContentEG3,setModalContentEG3,setModalContentEG4,setModalContentEG2, children}) {
    const { isChecked } = useContext(MyGameContext);
    function close() {
        setModalContentEG3({show:false,content:""});
    }
    return (
        <>
            {createPortal(
                <div
                    className={`modalContainer ${modalContentEG3.show ? "showModal" : ""} `}
                    onClick={() => close()}
                >
                    <div className="modal dark from-right" onClick={(e) => e.stopPropagation()}>
                        <header className="modal_header">
                            <h3 className="modal_header-clueDetails">How to Play (3 of 5)</h3>
                            <button className="close" onClick={() => close()}>
                                <img src={Close} alt="close" />
                            </button>
                        </header>
                        <main className="modal_content">
                            <View className={"dark"}>
                                {children}
                            </View>
                        </main>
                        <footer className="modal_footer">
                            <Button margin="0 0 0 0" className="button"
                                    onClick={() => {
                                        close();
                                        setModalContentEG4({
                                            show: true,
                                            content: "Example Game4"
                                        })
                                    }}>Next</Button>
                            <Button margin="0 10px 0 0" className="button"
                                    onClick={() => {
                                        close();
                                    }}>Close</Button>
                            <Button margin="0 10px 0 0" className="button"
                                    onClick={() => {
                                        close();
                                        setModalContentEG2({
                                            show: true,
                                            content: "Example Game2"
                                        })
                                    }}>Back</Button>

                        </footer>
                    </div>
                </div>,
                document.getElementById("modal")
            )}
        </>
    )
}
export function ModalExampleGame4({modalContentEG4,setModalContentEG4,setModalContentEG3,setModalContentEG5, children}) {
    const { isChecked } = useContext(MyGameContext);
    function close() {
        setModalContentEG4({show:false,content:""});
    }
    return (
        <>
            {createPortal(
                <div
                    className={`modalContainer ${modalContentEG4.show ? "showModal" : ""} `}
                    onClick={() => close()}
                >
                    <div className="modal dark from-right" onClick={(e) => e.stopPropagation()}>
                        <header className="modal_header">
                            <h3 className="modal_header-clueDetails">How to Play (4 of 5)</h3>
                            <button className="close" onClick={() => close()}>
                                <img src={Close} alt="close" />
                            </button>
                        </header>
                        <main className="modal_content">
                            <View className={"dark"}>
                                {children}
                            </View>
                        </main>
                        <footer className="modal_footer">
                            <Button margin="0 0 0 0" className="button"
                                    onClick={() => {
                                        close();
                                        setModalContentEG5({
                                            show: true,
                                            content: "Example Game5"
                                        })
                                    }}>Next</Button>
                            <Button margin="0 10px 0 0" className="button"
                                    onClick={() => {
                                        close();
                                    }}>Close</Button>
                            <Button margin="0 10px 0 0" className="button"
                                    onClick={() => {
                                        close();
                                        setModalContentEG3({
                                            show: true,
                                            content: "Example Game3"
                                        })
                                    }}>Back</Button>

                        </footer>
                    </div>
                </div>,
                document.getElementById("modal")
            )}
        </>
    )
}
export function ModalExampleGame5({modalContentEG5,setModalContentEG5,setModalContentEG4, children}) {
    const { isChecked } = useContext(MyGameContext);
    function close() {
        setModalContentEG5({show:false,content:""});
    }
    return (
        <>
            {createPortal(
                <div
                    className={`modalContainer ${modalContentEG5.show ? "showModal" : ""} `}
                    onClick={() => close()}
                >
                    <div className="modal dark from-right" onClick={(e) => e.stopPropagation()}>
                        <header className="modal_header">
                            <h3 className="modal_header-clueDetails">How to Play (5 of 5)</h3>
                            <button className="close" onClick={() => close()}>
                                <img src={Close} alt="close" />
                            </button>
                        </header>
                        <main className="modal_content">
                            <View className={"dark"}>
                                {children}
                            </View>
                        </main>
                        <footer className="modal_footer">
                            <Button margin="0 10px 0 0" className="button"
                                    onClick={() => {
                                        close();
                                    }}>Next/Close</Button>
                            <Button margin="0 10px 0 0" className="button"
                                    onClick={() => {
                                        close();
                                        setModalContentEG4({
                                            show: true,
                                            content: "Example Game4"
                                        })
                                    }}>Back</Button>

                        </footer>
                    </div>
                </div>,
                document.getElementById("modal")
            )}
        </>
    )
}

export function ModalWaiver({modalContentGI,setModalContentGI,children}) {
    const { isChecked } = useContext(MyGameContext);
    function close() {
        setModalContentGI({show:false,content:""});
    }
    return (
        <>
            {createPortal(
                <div
                    className={`modalContainer ${modalContentGI.show ? "showModal" : ""} `}
                    onClick={() => close()}
                >
                    <div className="modal dark from-right" onClick={(e) => e.stopPropagation()}>
                        <header className="modal_header">
                            <h2 className="modal_header-clueDetails">{modalContentGI.content}</h2>
                            <button className="close" onClick={() => close()}>
                                <img src={Close} alt="close" />
                            </button>
                        </header>
                        <main className="modal_content">
                            <View className={"dark"}>
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

export function ModalPuzzle({modalPuzzleContent,setModalPuzzleContent,puzzleDetails,children}) {
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
                                <h2 className="modal_header-clueDetails">{puzzleDetails.puzzleName}</h2>
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
                        <View className={"dark"}>
                            {children}
                        </View>
                    </main>
                    <footer className="modal_footer">
                        <button className="submit" className={"add-clue"} onClick={()=>
                        {setCluesFunction(clueDetails.gameClueName,clueDetails.gameClueText,clueDetails.gameClueID,clueDetails.gameClueImage);close();
                        }}>add clue to notes</button>
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
    if (modalContent.content === "Map" || modalContent.content === "MapPlaceView") mapClass="-Map";
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
export function ReactModalFromBottomMap({modalContentMap, setModalContentMap, children}) {
    console.log("ReactModalFromBottomGI: " + modalContentMap.open);
    let mapClass="";
    if (modalContentMap.content === "Map") mapClass="-Map";
    Modal.setAppElement("#modal");
    function closeModal() {
        setModalContentMap({open:false,content:""});
    }
    return (
        <>
            {createPortal(<Modal
                    closeTimeoutMS={200}
                    isOpen={modalContentMap.open}
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
                        <Heading level={4} marginBottom="10px" className={"modal-header"}>{modalContentMap.content}</Heading>
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