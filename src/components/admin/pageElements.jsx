import {Button, Heading, Icon, Image, View, Flex} from "@aws-amplify/ui-react";
import React, {useState} from "react";
import {useNavigate} from 'react-router-dom';
import Close from "../../assets/times-solid-svgrepo-com.svg";
import leftArrow from "../../assets/left-arrow-svgrepo-com.svg";
import rightArrow from "../../assets/right-arrow-svgrepo-com.svg";
import homeIcon from "../../assets/noun-home-7100601.svg";
import dashBoardIcon from "../../assets/noun-dashboard-7064012.svg";
import gameIcon from "../../assets/noun-tactics-6452991.svg";
import userIcon from "../../assets/noun-user-1994976.svg";


export const HeadingComponent = props => {
    const navigate = useNavigate();
    console.log("props.userName: " + props);
    let displaySection = props.displaySection;
    let setDisplaySection = props.setDisplaySection;
    for (const key in props) {
        console.log(`${key}: ${ props[key]}`);
    }
    return (
       <View className={"header"}>
           <Heading className={"admin-content-header"} level={4}>Welcome {props.userName} </Heading>
           <View className={"admin-content-header-nav"}>
                   {displaySection.homeSection ? (
                           <View className={"admin-nav-link-container admin-nav-icon-border"} onClick={() => setDisplaySection({...displaySection, homeSection: false})}>
                               <Image className="admin-nav-icon"  src={dashBoardIcon} alt="dashboard icon" />
                           </View>) :
                       ( <View className={"admin-nav-link-container"}  onClick={() => setDisplaySection({...displaySection, homeSection: true})}>
                           <Image className="admin-nav-icon"  src={dashBoardIcon} alt="dashboard icon" />
                       </View>)
                   }
                   {displaySection.gameSection ? (
                           <View className={"admin-nav-link-container admin-nav-icon-border"} onClick={() => setDisplaySection({...displaySection, gameSection: false})}>
                               <Image className="admin-nav-icon"  src={gameIcon} alt="game icon" />
                           </View>) :
                       ( <View className={"admin-nav-link-container"}  onClick={() => setDisplaySection({...displaySection, gameSection: true})}>
                           <Image className="admin-nav-icon"  src={gameIcon} alt="game icon" />
                       </View>)
                   }
                   {displaySection.userSection ? (
                           <View className={"admin-nav-link-container admin-nav-icon-border"} onClick={() => setDisplaySection({...displaySection, userSection: false})}>
                               <Image className="admin-nav-icon"  src={userIcon} alt="user icon" />
                          </View>) :
                       ( <View className={"admin-nav-link-container"}  onClick={() => setDisplaySection({...displaySection, userSection: true})}>
                           <Image className="admin-nav-icon"  src={userIcon} alt="user icon" />
                         </View>)
                   }

                   <View className={"admin-nav-link-container"} onClick={() => navigate('/')}>
                       <Image className="admin-nav-icon"  src={homeIcon} alt="home icon" />
                   </View>

               </View>
       </View>
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
            <View className={"header"}><Heading className={"admin-nav-header"} level={3} color="black">Admin</Heading></View>
            <View padding=".5rem 0">
                {displaySection.homeSection ? (
                    <View className={"admin-nav-link-container admin-nav-icon-border"} onClick={() => setDisplaySection({...displaySection, homeSection: false})}>
                        <Image className="admin-nav-icon"  src={dashBoardIcon} alt="dashboard icon" />
                        <View className={sidebarDisplay? "show-inline admin-nav-link " : "hide"}>Dashboard</View></View>) :
                    ( <View className={"admin-nav-link-container"}  onClick={() => setDisplaySection({...displaySection, homeSection: true})}>
                        <Image className="admin-nav-icon"  src={dashBoardIcon} alt="dashboard icon" />
                        <View className={sidebarDisplay? "show-inline admin-nav-link" : "hide"}>Dashboard</View></View>)
                }
                {/*displaySection.adminSection ? (
                    <Button marginRight="5px" onClick={() => setDisplaySection({...displaySection,
                        adminSection: false
                    })}>Hide Admin Section</Button>) : (
                    <Button marginRight="5px" onClick={() => setDisplaySection({...displaySection,
                        adminSection: true
                    })}>Show Admin Section</Button>)
                */}
                {displaySection.gameSection ? (
                        <View className={"admin-nav-link-container admin-nav-icon-border"} onClick={() => setDisplaySection({...displaySection, gameSection: false})}>
                            <Image className="admin-nav-icon"  src={gameIcon} alt="game icon" />
                            <View className={sidebarDisplay? "show-inline admin-nav-link " : "hide"}>Games</View>

                        </View>) :
                    ( <View className={"admin-nav-link-container"}  onClick={() => setDisplaySection({...displaySection, gameSection: true})}>
                        <Image className="admin-nav-icon"  src={gameIcon} alt="game icon" />
                        <View className={sidebarDisplay? "show-inline admin-nav-link" : "hide"}>Games</View></View>)
                }
                {displaySection.userSection ? (
                        <View className={"admin-nav-link-container admin-nav-icon-border"} onClick={() => setDisplaySection({...displaySection, userSection: false})}>
                            <Image className="admin-nav-icon"  src={userIcon} alt="user icon" />
                            <View className={sidebarDisplay? "show-inline admin-nav-link" : "hide"}>Users</View></View>) :
                    ( <View className={"admin-nav-link-container"}  onClick={() => setDisplaySection({...displaySection, userSection: true})}>
                        <Image className="admin-nav-icon"  src={userIcon} alt="user icon" />
                        <View className={sidebarDisplay? "show-inline admin-nav-link" : "hide"}>Users</View></View>)
                }

                <View className={"admin-nav-link-container"} onClick={() => navigate('/')}>
                    <Image className="admin-nav-icon"  src={homeIcon} alt="home icon" />
                </View>
                <Flex className={"admin-nav-link-container"}>
                    <Image className="admin-nav-icon" marginLeft={"5px"}  height="20px" width="20px" src={rightArrow} alt="right arrow" />
                    <View className={sidebarDisplay? "show-inline admin-nav-link small " : "hide"}>clue icons: diary, tornPaper, messageInABottle, clueIcon, clueNoteIcon, envelope</View>
                </Flex>
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