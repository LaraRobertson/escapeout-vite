import {Button, Heading, Icon, Image, View} from "@aws-amplify/ui-react";
import React, {useState} from "react";
import {useNavigate} from 'react-router-dom';
import Close from "../../assets/times-solid-svgrepo-com.svg";
import leftArrow from "../../assets/left-arrow-svgrepo-com.svg";
import rightArrow from "../../assets/right-arrow-svgrepo-com.svg";


export const HeadingComponent = props => {
    console.log("props.userName: " + props);
    for (const key in props) {
        console.log(`${key}: ${ props[key]}`);
    }
    return (
        <>
        <Heading level={3} color="black">Admin</Heading>
        <Heading level={4} paddingBottom="10px" backgroundColor="white" color="black">Welcome {props.userName} </Heading>
        </>
    )
}
export function AdminNav(props) {
    let displaySection = props.displaySection;
    let setDisplaySection = props.setDisplaySection;
    const [sidebarDisplay, setSideBarDisplay] = useState(true);
    function closeSideBar() {
        setSideBarDisplay(!sidebarDisplay);
    }
    const navigate = useNavigate();
    return (
        <View id="adminNavBar" className={sidebarDisplay? "admin-nav-open" : "admin-nav-closed"}>
            <View padding=".5rem 0">
                {displaySection.homeSection ? (
                    <Button marginRight="5px" onClick={() =>
                        setDisplaySection({...displaySection, homeSection: false})}>Hide Home Section</Button>) :
                    (<Button marginRight="5px" onClick={() =>
                        setDisplaySection({...displaySection, homeSection: true})}>Show Home Section</Button>)
                }
                {displaySection.adminSection ? (
                    <Button marginRight="5px" onClick={() => setDisplaySection({...displaySection,
                        adminSection: false
                    })}>Hide Admin Section</Button>) : (
                    <Button marginRight="5px" onClick={() => setDisplaySection({...displaySection,
                        adminSection: true
                    })}>Show Admin Section</Button>)
                }

                {displaySection.gameSection ? (
                    <Button marginRight="5px" onClick={() => setDisplaySection({...displaySection,
                        gameSection: false
                    })}>Hide Game Section</Button>) : (
                    <Button marginRight="5px" onClick={() => setDisplaySection({...displaySection,
                        gameSection: true
                    })}>Show Game Section</Button>)
                }
                {displaySection.userSection ? (
                    <Button marginRight="5px" onClick={() => setDisplaySection({...displaySection,
                        userSection: false
                    })}>Hide User Section</Button>) : (
                    <Button marginRight="5px" onClick={() =>setDisplaySection({...displaySection,
                        userSection: true
                    })}>Show User Section</Button>)
                }
                <br />
                <Button marginRight="5px" onClick={() => navigate('/')}>Home</Button>
                <View className={sidebarDisplay? "sider-trigger-open" : "sider-trigger-closed"}>
                    <Button gap="0.1rem" size="small" className={"no-border"} onClick={closeSideBar}>
                        {sidebarDisplay? <Image height="20px" width="20px" src={leftArrow} alt="left arrow" /> :
                            <Image height="20px" width="20px" src={rightArrow} alt="right arrow" />}

                    </Button>
                </View>
            </View>

        </View>
    )
}