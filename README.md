## Documentation by Nordkern

### Checkboxes
HTML
```html
<label className="checkbox-container">
  <FormattedMessage
    id="some translation key here"
    defaultMessage="*translation missing*"
  />
  <input
    type="checkbox"
    onClick={text => setFieldValue("isOfficer", !values.isOfficer)}
  />
  <span className="checkmark"></span>
</label>
```
CSS
```css
/* checkbox styling begins */
.checkbox-container {
    display: flex;
    justify-content: left;
    position: relative;
    padding-left: 35px;
    margin-bottom: 12px;
    cursor: pointer;
    font-size: 22px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}

.checkbox-container span {
    font-family: "Karla", sans-serif;
    color: #354052;
    font-size: 16px;
}

/* Hide the browser's default checkbox */
.checkbox-container input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
}

/* Create a custom checkbox */
.checkmark {
    position: absolute;
    top: 0;
    left: 0;
    height: 25px;
    width: 25px;
    background-color: #f5eedd;
    border: 1px solid #eee0bf;
    border-radius: 8px;
}

/* On mouse-over, add a grey background color */
.checkbox-container:hover input ~ .checkmark {
    background-color: #fbf5ea;
}

/* When the checkbox is checked, add a blue background */
.checkbox-container input:checked ~ .checkmark {
    background-color: #107495;
    border: 1px solid #107495;
}

/* Create the checkmark/indicator (hidden when not checked) */
.checkmark:after {
    content: "";
    position: absolute;
    display: none;
}

/* Show the checkmark when checked */
.checkbox-container input:checked ~ .checkmark:after {
    display: block;
}

/* Style the checkmark/indicator */
.checkbox-container .checkmark:after {
    left: 9px;
    top: 5px;
    width: 5px;
    height: 10px;
    border: solid white;
    border-width: 0 3px 3px 0;
    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);
}
/* checkbox styling ends */
```


## Other
This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

Below you will find some information on how to perform common tasks.<br>
You can find the most recent version of this guide [here](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md).
