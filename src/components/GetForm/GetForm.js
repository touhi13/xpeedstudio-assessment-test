import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const GetForm = () => {
    const [formData, setFormData] = useState({});
    const [formValue, setFormValue] = useState([]);
    const [error, setError] = useState([]);
    const location = useLocation();
    const [message, setMessage] = useState({});
    const [repeater, setRepeater] = useState(0);
    // get form data
    useEffect(() => {
        const id = location.pathname.split('/').pop();
        let url = '';
        //check current location
        if (location.pathname === '/get_form') {
            url = `http://localhost/api/get_form.php`;
        } else {
            const id = location.pathname.split('/').pop();
            url = `http://localhost/api/get_form.php?id=${id}`;
        }
        // fetching data
        axios.get(url)
            .then(res => {
                setFormData(res.data.data.fields[0]);
            })
    }, []);

    const handleRepeater = (valueArr, key) => {
        setRepeater(repeater + 1);

    }
    // set form input value
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValue(formValue => ({ ...formValue, [name]: value }));
    }
    // handle submit form 
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError([]);
        setMessage({}); 
        if (await handleValidation()) {
            axios.get('http://localhost/api/submit_form.php', formData)
                .then(res => {
                    //console.log(res.data);
                    if (error.length === 0) {
                        //console.log(res.data);
                        setMessage(res.data);
                    }
                })
        }


    }
    // handle validation
    const handleValidation = async () => {
        let errorArr = [];
        for (let key in formValue) {
            const validator = formData[key]?.validate;
            if (validator !== undefined) {
                if (validator.includes('|')) {
                    const validatorArr = validator.split('|');
                    for (let i = 0; i < validatorArr.length; i++) {
                        errorArr.push(validation(validatorArr[i], key, formValue[key]));
                    }
                } else {
                    errorArr.push(validation(validator, key, formValue[key]));
                }
            }
        }
        // filter null value
        const filterArr = errorArr.filter(item => item !== null);
        setError(filterArr);
        if (filterArr.length === 0) {
            return true;
        } else {

            return false;
        }
    }
    // check validation
    const validation = (string, key, value) => {
        if (string.includes('only_letters')) {
            const letters =/^[a-zA-Z ]*$/;
            if (!value.match(letters)) {
                return `${formData[key].title} must contain only letters`;
            } else {
                return null
            }

        } else if (string.includes('number')) {
            const number = /^[0-9]+$/;
            if (!value.match(number)) {
                return `${formData[key].title} must contain only numbers`;
            } else {
                return null
            }

        } else if (string.includes('email')) {
            let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            if (!value.match(regexEmail)) {
                return 'Email is not valid';

            } else {
                return null
            }
        } else if (string.includes('max')) {
            const max = string.split('max')[1];
            if (value.length > max) {
                return `${formData[key].title}'s maximum length is ${max}`;
            } else {
                return null
            }
        } else if (string.includes('min')) {
            const min = string.split('min')[1];
            if (value.length < min) {
                return `${formData[key].title}'s minimum length is ${min}`;
            } else {
                return null
            }
        }
    }

    return (
        <div className="container">
            <div>
                {
                    // display validation error
                    error.map((err, i) => {
                        return <p className="text-danger" key={i}>{err}</p>
                    })

                }
            </div>
            <div>
                {
                    // display submit message
                    message.messages?.length && message.messages.map((msg) => {
                        return <p className={message.status === 'success' ? 'text-success' : 'text-danger'}>{msg}</p>
                    })
                }
            </div>
            <form onSubmit={handleSubmit}>
                {
                    // display form fields
                    Object.keys(formData).map((key) => {
                        if (formData[key].type === 'textarea') {
                            return (
                                <div key={key} className='mb-3 row'>
                                    <label className="col-sm-2 col-form-label">{formData[key].title}</label>
                                    <div className="col-sm-10">
                                        <textarea name={key} required={formData[key].required} readOnly={formData[key].readonly}{...formData[key].html_attr} onChange={e => handleChange(e)} defaultValue={formData[key].value}></textarea>
                                    </div>
                                </div>
                            )
                        } else if (formData[key].type === 'select') {
                            return (
                                <div key={key} className='mb-3 row'>
                                    <label className="col-sm-2 col-form-label">{formData[key].title}</label>
                                    <div className="col-sm-10">
                                        <select name={key} required={formData[key].required} readOnly={formData[key].readonly} defaultValue={location.pathname === '/get_form' ? formData[key].default : formData[key].value} onChange={e => handleChange(e)}>
                                            {
                                                formData[key].options.map((option) => {
                                                    return <option key={option.key} value={option.key}>{option.label} </option>
                                                })
                                            }
                                        </select>
                                    </div>
                                </div>
                            )
                        } else if (formData[key].type === 'radio') {
                            return (
                                <div key={key} className='mb-3 row'>
                                    <label className="col-sm-2 col-form-label">{formData[key].title}</label>
                                    <div className="col-sm-10">
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
                                </div>
                            )
                        } else if (formData[key].type === 'repeater') {
                            return (
                                <div key={key} className='mb-3 row'>
                                    <label className="col-sm-2 col-form-label">{formData[key].title}</label>
                                    <div className="col-sm-10">

                                        {
                                            // formData[key].repeater_fields.map((field) => {
                                            repeater === 0 ?
                                                Object.keys(formData[key].repeater_fields).map((field) => {
                                                    return (
                                                        <div key={field}>
                                                            <label>{formData[key].repeater_fields[field].title}</label><br />
                                                            <input type={formData[key].repeater_fields[field].type} name={`${key}[${field}]`} required={formData[key].repeater_fields[field].required} onChange={e => handleChange(e)} />
                                                        </div>
                                                    )
                                                })
                                                :
                                                handleRepeater(formData[key].value.length)
                                        }
                                        <button type="button" onClick={() => { handleRepeater(formData[key].value.length, key) }}>+</button>
                                    </div>
                                </div>
                            )
                        }
                        else {
                            return (
                                <div key={key} className='mb-3 row'>
                                    <label className="col-sm-2 col-form-label">{formData[key].title}</label>
                                    <div className="col-sm-10">
                                        <input type={formData[key].type} name={key} required={formData[key].required} readOnly={formData[key].readonly}{...formData[key].html_attr} onChange={e => handleChange(e)} defaultValue={formData[key].value} />
                                    </div>
                                </div>
                            )
                        }
                    })

                }
                <button className='btn btn-primary' type="submit">Submit</button>
            </form>
        </div>
    );
};

export default GetForm;