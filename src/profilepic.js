import React from "react";

export default function ProfilePic(props) {
    var url;
    if (props.url == null) {
        url = "/empty-profile.jpg";
    } else {
        url = props.url;
    }
    return (
        <div className="profilepic-card">
            <h3>
                {props.first} {props.last}
            </h3>
            <img
                src={url}
                onClick={props.handleShowUploader}
                width={props.size == "large" ? "300" : "100"}
            />
        </div>
    );
}
