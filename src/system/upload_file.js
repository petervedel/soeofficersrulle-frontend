import React, { Component } from 'react'
import { CardTitle } from 'reactstrap'
import ReactFileReader from 'react-file-reader'
import { uploadCSV } from '../_actions'
import { FormattedMessage } from 'react-intl'

class UploadFile extends Component {

    constructor(props) {
        super(props)

        this.state = {
            uploading: false,
            uploadSuccess: false,
            uploadError: false,
            errorMsg: ''
        }

        this.props.showBreadCrumbs(false)
    }

    handleFiles = files => {
        this.setState({
            uploading: false,
            uploadSuccess: false,
            uploadError: false,
            errorMsg: ''
        })
        if (files.length) {
            let reader = new FileReader()
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
                )

            }
            reader.readAsText(files[0])
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
            <div className="col-md-12 col-lg-8 col-lx-6 mb-4">
                <CardTitle>
                    <FormattedMessage
                        id="system.file_upload_actions"
                        defaultMessage="*translation missing*"
                    />
                </CardTitle>
                <div className="alert alert-dark" role="alert">
                    <FormattedMessage
                        id="system.file_upload_actions_description"
                        defaultMessage="*translation missing*"
                    />
                    <i>
                        <FormattedMessage
                            id="system.file_upload_actions_description_example"
                            defaultMessage="*translation missing*"
                        />
                    </i>
                </div>
                <ReactFileReader
                    fileTypes={[".csv"]}
                    handleFiles={this.handleFiles}
                >
                    <button disabled={this.state.uploading} className='btn btn-primary mt-2'>
                        <FormattedMessage
                            id="system.upload_csv_file"
                            defaultMessage="*translation missing*"
                        />
                    </button>
                </ReactFileReader>
                {this.state.uploading && <p className="text pt-2">
                    <FormattedMessage
                        id="system.uploading_file_values"
                        defaultMessage="*translation missing*"
                    />
                </p>}
                {this.state.uploadSuccess && <p className="text-success p-2">
                    <FormattedMessage
                        id="system.uploading_success"
                        defaultMessage="*translation missing*"
                    />
                </p>}
                {this.state.uploadError && <p className="text-danger p-2">
                    <FormattedMessage
                        id="system.uploading_error"
                        defaultMessage="*translation missing*"
                    />
                </p>}
            </div>
        )
    }
}

export default UploadFile