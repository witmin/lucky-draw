(function ($, document, machine) {

    const Item = ({text, onDelete}) => (
        <li key={Math.random()} id={text}>{text}
            <span className="delete" title="Delete" onClick={() => onDelete(text)}><i className="fa fa-minus-circle"/></span>
        </li>);

    const CandidateList = ({items, onDelete}) => {

        return <ul className="item-list">{items.map((itemText, i) => <Item text={itemText} key={i} onDelete={onDelete}/>)}</ul>;
    };

    const ImportButton = () => {

        function processData(allText) {
            const allTextLines = allText.split(/\r\n|\n/);
            const headers = allTextLines[0].split(',');
            const lines = [];

            for (let i = 1; i < allTextLines.length; i++) {
                const data = allTextLines[i].split(',');
                if (data.length === headers.length) {

                    const tarr = [];
                    for (let j = 0; j < headers.length; j++) {
                        tarr.push(data[j]);
                    }
                    lines.push(tarr);
                }
            }
            return {headers, lines};
        }

        const onFileChange = (e) => {

            const files = e.target.files;

            console.log(files);

            const reader = new FileReader();

            // Closure to capture the file information.
            reader.onload = function (e) {
                const content = e.target.result;
                const data = processData(content);
                data.lines.forEach((line) => {
                    machine.addCandidate(line.join('\t'));
                });
            };

            reader.readAsText(files[0]);
        };

        return (
            <label className={"btn positive-btn"} htmlFor={"file-input"}>
                Import from CSV {" "}<i className="fa fa-plus"/>
                <input type={"file"} style={{display: 'none'}} id={"file-input"} onChange={onFileChange}/>
            </label>
        )
    };

    class InputForm extends React.Component {

        constructor(props) {
            super(props);
            this.handleAdd = this.handleAdd.bind(this);
            this.handleChangeNumberOfDraws = this.handleChangeNumberOfDraws.bind(this);
            this.handleChangeFontSize = this.handleChangeFontSize.bind(this);
            this.state = {
                items: [],
                input: "",
                isWithoutReplacement: false,
                numberOfDraws: 1,
                fontSize: 24
            }
        }

        componentDidMount() {
            fetch("/configs")
                .then((res) => res.json())
                .then((result) => {
                    this.setState({
                        items: result.candidates,
                        isWithoutReplacement: result.isWithoutReplacement,
                        numberOfDraws: result.numberOfDraws,
                        fontSize: result.fontSize
                    }, () => {
                        if (result.candidates.length > 0) {
                            window.showEditListView();
                        }
                        machine.onResultChange((poorMan) => {

                            // TODO convert these to React style
                            $('.main-container').removeClass('show animated fadeOutUp');
                            $('.main-container').addClass('hide');
                            $('#result-view-container').addClass('show animated fadeInDown');

                            const container = $('#winner-container').empty();
                            poorMan.forEach(() => {
                                container.append($("<h1>", {
                                    class: "winner masked",
                                    css: {
                                        'font-size': this.state.fontSize + 'px',
                                        'min-height': this.state.fontSize
                                    }
                                }));
                            });
                            $('#save-result').off('click.save').on('click.save', () => {
                                let blob = new Blob([poorMan.join('\n')], {type: "text/plain;charset=utf-8"});
                                saveAs(blob, "result.txt");
                            });

                            let count = 0;

                            const t = setInterval(function () {

                                $('.winner.masked:first').removeClass('masked')
                                    .append($("<span>", {
                                        class: "fa fa-trophy"
                                    }))
                                    .append($("<span>").text(poorMan[count]));
                                count++;
                                if (count === poorMan.length) {
                                    clearInterval(t);
                                }
                            }, 1000);
                        });
                    })
                });

            machine.onSettingChange((settings) => {

                this.setState({
                    ...settings
                });
            });

            machine.registerCandidatesUpdateHandler((candidates) => {
                this.setState({
                    items: candidates
                });
            });
        }

        handleChange(name) {
            return (e) => {
                this.setState({
                    [name]: e.target.value
                })
            }
        }

        handleChangeNumberOfDraws(e) {
            const v = e.target.value;
            this.setState({
                numberOfDraws: v
            }, () => {
                if (!isNaN(v)) {

                    machine.setSettings({numberOfDraws: +v});
                }
            })
        }

        handleChangeFontSize(e) {
            const v = e.target.value;
            this.setState({
                fontSize: v
            }, () => {
                if (!isNaN(v)) {

                    machine.setSettings({fontSize: +v});
                }
            })
        }

        handleAdd(e) {
            e.preventDefault();
            machine.addCandidate(this.state.input);
            this.setState({
                input: ""
            })
        }

        handleDelete(val) {

            machine.removeCandidate(val);
        }

        handleDeleteAll() {

            machine.clearCandidates();
        }

        handleInputDone(e) {
            $('.main-container').removeClass('show animated fadeOutUp');
            $('.main-container').addClass('hide');
            $('#start-view-container').addClass('show animated fadeInDown');
        }

        setWithoutReplacement() {
            machine.setSettings({isWithoutReplacement: $('#rand-without-replacement').is(':checked')});
        }

        render() {

            return (
                <div>
                    <h1>Edit Items</h1>
                    <form id="edit-item-form" onSubmit={this.handleAdd}>
                        <input value={this.state.input} type="text" placeholder="Enter item name" id="new-candidate"
                               onChange={this.handleChange('input')}/>
                        <div className={"btn-set inline-block"}>
                            <button className="btn positive-btn" title="Add" onClick={this.handleAdd}>
                                <i className="fa fa-plus"></i>
                            </button>
                            <ImportButton/>
                        </div>
                        <div className="item-list-container">
                            <h2>Items List</h2>
                            <CandidateList items={this.state.items} onDelete={this.handleDelete}/>
                            <div className="text-right float-right">
                                <a className="delete-all" onClick={this.handleDeleteAll}>
                                    <i className="fa fa-times"></i>
                                    Delete All
                                </a>
                            </div>
                            <div style={{marginBottom: 16, marginTop: 16 }}>
                                <label className={"block"} style={{marginBottom: 2}}>Number Of Draws per batch</label>
                                <input value={this.state.numberOfDraws} type="number" placeholder="Number Of Draws" id="number-of-draws"
                                       onChange={this.handleChangeNumberOfDraws} min={1} max={Math.max(this.state.items.length, 1)}/>
                            </div>
                            <div style={{marginBottom: 16, marginTop: 16}}>
                                <label className={"block"} style={{marginBottom: 2}}>Font Size (in pixel)</label>
                                <input value={this.state.fontSize} type="number" placeholder="Font Size (in pixel)" id="font-size"
                                       onChange={this.handleChangeFontSize}/>
                            </div>
                            <label htmlFor="rand-without-replacement" className="text-left">
                                <input checked={!!this.state.isWithoutReplacement} onChange={this.setWithoutReplacement} type="checkbox"
                                       id="rand-without-replacement" name="without-replacement"/>
                                Draw without replacement
                            </label>
                        </div>
                        <div className="btn-set">
                            <button className="btn primary-btn btn-done" onClick={this.handleInputDone}>Done</button>
                        </div>
                    </form>
                </div>
            );
        }
    }

    ReactDOM.render(
        <InputForm items={[]}/>, document.querySelector('#edit-item-container')
    );
})(jQuery, document, window.machine);
