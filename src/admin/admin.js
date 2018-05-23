import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import ReactFileReader from 'react-file-reader';
import { uploadCSV } from '../_actions'
import { FormattedMessage } from 'react-intl'

class AdminDashBoard extends Component {

    constructor(props) {
        super(props)

        this.state = {
            uploading: false,
            uploadSuccess: false,
            uploadError: false,
            errorMsg: ''
        }
    }

    handleFiles = files => {
        this.setState({
            uploading: false,
            uploadSuccess: false,
            uploadError: false,
            errorMsg: ''
        })
        if (files.length) {
            let reader = new FileReader();
            let that = this
            reader.onload = function (e) {
                that.setState({
                    uploading: true,
                })
                let values = { 'file': reader.result }
                uploadCSV(values).then(
                    response => {
                        that.setState({
                            uploading: false,
                            uploadSuccess: true,
                            uploadError: false,
                            errorMsg: ''
                        })

                    },
                    errors => {
                        that.setState({
                            uploading: false,
                            uploadSuccess: false,
                            uploadError: true,
                            errorMsg: errors.response.statusText
                        })
                    }
                );

            }
            reader.readAsText(files[0]);
        } else {
            this.setState({
                uploading: false,
                uploadSuccess: false,
                uploadError: false
            })
        }
    }

    render() {

        return (
            <div>
                <h3>
                    <FormattedMessage
                        id="admin.user_actions"
                        defaultMessage="*translation missing*"
                    />
                </h3>
                <Link to="/user/create" className="btn btn-primary m-2">
                    <FormattedMessage
                        id="admin.create_user"
                        defaultMessage="*translation missing*"
                    />
                </Link>
                <Link to="/user/search" className="btn btn-primary m-2">
                    <FormattedMessage
                        id="admin.search_user"
                        defaultMessage="*translation missing*"
                    />
                </Link>
                <h3 className="mt-5">
                    <FormattedMessage
                        id="admin.file_upload_actions"
                        defaultMessage="*translation missing*"
                    />
                </h3>
                <div className="alert alert-dark" role="alert">
                    <FormattedMessage
                        id="admin.file_upload_actions_description"
                        defaultMessage="*translation missing*"
                    />
                    <br />
                    <i>
                        <FormattedMessage
                            id="admin.file_upload_actions_description_example"
                            defaultMessage="*translation missing*"
                        />
                    </i>
                </div>
                <ReactFileReader
                    fileTypes={[".csv"]}
                    handleFiles={this.handleFiles}
                >
                    <button disabled={this.state.uploading} className='btn btn-primary ml-2'>
                        <FormattedMessage
                            id="admin.upload_csv_file"
                            defaultMessage="*translation missing*"
                        />
                    </button>
                </ReactFileReader>
                {this.state.uploading && <p className="text p-2">
                    <FormattedMessage
                        id="admin.uploading_file_values"
                        defaultMessage="*translation missing*"
                    />
                </p>}
                {this.state.uploadSuccess && <p className="text-success p-2">
                    <FormattedMessage
                        id="admin.uploading_success"
                        defaultMessage="*translation missing*"
                    />
                </p>}
                {this.state.uploadError && <p className="text-danger p-2">
                    <FormattedMessage
                        id="admin.uploading_error"
                        defaultMessage="*translation missing*"
                    />
                </p>}
            </div>
        )
    }
}

export default AdminDashBoard