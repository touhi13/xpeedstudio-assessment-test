import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const GetForm = () => {
    const [formData, setFormData] = useState({});
    const [formValue, setFormValue] = useState([]);
    const [error, setError] = useState([]);
    const location = useLocation();

    useEffect(() => {
        console.log(location.pathname);
        const id = location.pathname.split('/').pop();
        console.log(id);
        let url = '';
        if (location.pathname === '/get_form') {
            url = `http://localhost/api/get_form.php`;
        } else {
            const id = location.pathname.split('/').pop();
            console.log(id);
            url = `http://localhost/api/get_form.php?id=${id}`;
        }
        axios.get(url)
            .then(res => {
                setFormData(res.data.data.fields[0]);
                console.log(res.data.data.fields[0]);
                // console.log(data)
            })
    }, []);

    const handleRepeater = (valueArr, key) => {
        // let newArr;
        // if(valueArr.length === 0){
        //    const newArr= formData[key].value.push({},{}) ;
        //    setFormData(formData);
        // //    console.log(newArr);
        //    console.log(formData);
        // //    console.log(formData[key].value);

        // }else{
        //    const newArr= formData[key].value.push({});

        // }
    }
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValue(formValue => ({ ...formValue, [name]: value }));
        console.log(formValue);
    }
    const handleSubmit = (e) => {
        // setFormData(prevState => (...prevState,));
        e.preventDefault();
        for (let key in formValue) {
            // console.log(formValue[key])
            const validator = formData[key]?.validate;
            if (validator !== undefined) {
                console.log(validator)
                if (validator.includes('|')) {
                    const validatorArr = validator.split('|');
                    for (let i = 0; i < validatorArr.length; i++) {
                        console.log(validatorArr[i])
                        validation(validatorArr[i], key, formValue[key]);
                    }
                } else {
                    validation(validator, key, formValue[key]);
                }
            }
        }
        axios.get('http://localhost/api/submit_form.php', formData)
            .then(res => {
                // console.log(res.data.data.fields[0]);
                console.log(res.data)
            })
    }

    const validation = (string, key, value) => {
        if (string.includes('only_letters')) {
            console.log(value)
            const letters = /^[A-Za-z]+$/;
            if (!value.match(letters)) {
                setError(error => ([ ...error, `${formData[key].title} must contain only letters` ]));

            }

        } else if (string.includes('number')) {
            const number = /^[0-9]+$/;
            if (!value.match(number)) {
                setError(error => ([ ...error, `${formData[key].title} must contain only numbers` ]));
            }

        } else if (string.includes('email')) {
            let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            if (value.match(regexEmail)) {
                return true;
            } else {
                setError(error => ([ ...error, 'Email is not valid' ]));
     
            }
        } else if (string.includes('max')) {
            const max = string.split('max')[1];
            if (value.length <= max) {
                return true;
            } else {
                setError(error => ([ ...error, `${formData[key].title}'s maximum length is ${max}` ]));
            }
        } else if (string.includes('min')) {
            const min = string.split('min')[1];
            if (value.length >= min) {
                return true;
            } else {
                setError(error => ([ ...error, `${formData[key].title}'s minimum length is ${min}` ]));
            }
        }
    }

    return (
        <>
            <div>
                {
                    // console.log(error)
                    error.map((err, i) => {
                        return <p key={i}>{err}</p>
                    })
                }
            </div>
            <form onSubmit={handleSubmit}>
                {
                    Object.keys(formData).map((key) => {
                        if (formData[key].type === 'textarea') {
                            return (
                                <div key={key}>
                                    <label >{formData[key].title}</label>
                                    <textarea name={key} required={formData[key].required} readOnly={formData[key].readonly}{...formData[key].html_attr} onChange={e => handleChange(e)} defaultValue={formData[key].value}></textarea>
                                </div>
                            )
                        } else if (formData[key].type === 'select') {
                            return (
                                <div key={key}>
                                    <label >{formData[key].title}</label>
                                    <select name={key} required={formData[key].required} readOnly={formData[key].readonly} defaultValue={location.pathname === '/get_form' ? formData[key].default : formData[key].value} onChange={e => handleChange(e)}>
                                        {
                                            formData[key].options.map((option) => {
                                                console.log(formData[key].default === option.key);
                                                return <option key={option.key} value={option.key}>{option.label} </option>
                                            })
                                        }
                                    </select>
                                </div>
                            )
                        } else if (formData[key].type === 'radio') {
                            return (
                                <div key={key}>
                                    <label >{formData[key].title}</label>
                                    {
                                        formData[key].options.map((option) => {
                                            return (
                                                <div key={option.key}>
                                                    <input type="radio" name={key} value={option.key} required={formData[key].required} readOnly={formData[key].readonly} defaultChecked={location.pathname === '/get_form' ? formData[key].default === option.key : formData[key].value === option.key} onChange={e => handleChange(e)} />
                                                    <label >{option.label}</label>
                                                </div>

                                            )
                                        })
                                    }
                                </div>
                            )
                        } else if (formData[key].type === 'repeater') {
                            return (
                                <div key={key}>
                                    <label >{formData[key].title}</label>

                                    {
                                        // formData[key].repeater_fields.map((field) => {
                                        formData[key].value.length === 0 && !formData[key].repeater_click ?
                                            Object.keys(formData[key].repeater_fields).map((field) => {
                                                return (
                                                    <div key={field}>
                                                        <label>{formData[key].repeater_fields[field].title}</label>
                                                        <input type={formData[key].repeater_fields[field].type} name={`${key}[${field}]`} required={formData[key].repeater_fields[field].required} onChange={e => handleChange(e)} />
                                                    </div>
                                                )
                                            })
                                            :
                                            handleRepeater(formData[key].value.length)
                                    }
                                    <button type="button" onClick={() => { handleRepeater(formData[key].value.length, key) }}>Add</button>

                                </div>
                            )
                        }
                        else {
                            return (
                                <div key={key}>
                                    <label key={key}>{formData[key].title}</label>
                                    <input type={formData[key].type} name={key} required={formData[key].required} readOnly={formData[key].readonly}{...formData[key].html_attr} onChange={e => handleChange(e)} defaultValue={formData[key].value} />
                                </div>
                            )
                        }
                    })

                }
                <button type="submit">Submit</button>
            </form>
        </>
    );
};

export default GetForm;