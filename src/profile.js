import React from "react";
import Bioeditor from "./bioeditor";
import ProfilePic from "./profilepic";

export function Profile(props) {
    return (
        <div className="profile">
            <div className="profile-components">
                <ProfilePic
                    first={props.first}
                    last={props.last}
                    url={props.url}
                    handleShowUploader={props.handleShowUploader}
                    size="large"
                />
                <Bioeditor
                    bio={props.bio}
                    updateUserBio={props.updateUserBio}
                />
            </div>
        </div>
    );
}
