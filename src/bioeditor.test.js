import React from "react";
import axios from "./axios";
import App from "./app";
import Bioeditor from "./bioeditor";
import { shallow } from "enzyme";

jest.mock("./axios");

test('When no bio is passed to it, an "Add" button is rendered.', () => {
    const wrapper = shallow(<Bioeditor bio={null} />);
    expect(wrapper.find("button").contains("Add Bio")).toBe(true);
});

test('When a bio is passed to it, an "Edit" button is rendered.', () => {
    const wrapper = shallow(<Bioeditor bio={"string"} />);
    expect(wrapper.find("button").contains("Edit Bio")).toBe(true);
});

test('Clicking either the "Add" or "Edit" button causes a textarea and a "Save" button to be rendered.', () => {
    const onClick = jest.fn();

    const wrapper = shallow(<Bioeditor onClick={onClick} />);

    expect(
        wrapper.find("Add Bio" || "Edit Bio").contains("textarea" || "Save Bio")
    );
});

test('Clicking the "Save" button causes an ajax request.', async () => {
    const wrapper = shallow(<Bioeditor />);

    wrapper.find("button").simulate("click");

    expect(
        axios.post.mockResolvedValue({
            bio: "string",
            showEditor: false
        })
    );
});

test("When the mock request is successful, the function that was passed as a prop to the component gets called.", async () => {
    const wrapper = shallow(<Bioeditor onClick={this.handleEditing} />);

    wrapper.find("button").simulate("click");

    expect(this.handleEditing.mock.calls.length).toBe(1);
});
