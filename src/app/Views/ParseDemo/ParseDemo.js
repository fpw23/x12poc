import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import { compose } from 'redux'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import SplitPane from 'react-split-pane'
import { WithMessageBus, WithQuery } from 'common-tools/index'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import ReactJson from 'react-json-view'
import { TemplateEditor, TemplateEditorChannels } from './TemplateEditor'
import { DataEditor, DataEditorChannels } from './DataEditor'
import { withSnackbar } from 'notistack'

const styles = (theme) => ({
  root: {
    display: 'grid',
    height: '100vh',
    width: '100vw',
    gridTemplateRows: 'max-content 1fr',
    gridAutoColumns: '1fr',
    gridTemplateAreas: '"topBar" "body"',
    position: 'relative',
    boxSizing: 'border-box'
  },
  topBar: {
    gridArea: 'topBar',
    position: 'relative'
  },
  body: {
    gridArea: 'body',
    position: 'relative'
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  menuOption: {
    flex: 1
  },
  menuOptionText: {
    color: theme.palette.primary.contrastText
  },
  menuOptionFocused: {},
  menuOptionOutline: {
    '&$cssFocused $notchedOutline': {
      borderColor: `${theme.palette.primary.contrastText} !important`
    }
  },
  notchedOutline: {
    borderWidth: '1px',
    borderColor: `${theme.palette.primary.contrastText} !important`
  },
  title: {
    flex: 4
  }
})

export class ParseDemoPlain extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      Template: '',
      Data: '',
      VSplit: 0,
      HSplit: 0,
      Output: {},
      MessageId: '270'
    }
  }

  onNewMessage = (message) => {
    // eslint-disable-next-line default-case
    switch (message.Name) {
      case DataEditorChannels.DataUpdate:
      case TemplateEditorChannels.TemplateUpdate:
        this.updateOuptputPreview()
        break
    }
  }

  updateOuptputPreview = () => {
    const { ParseEDI, enqueueSnackbar, displayRuleMessages } = this.props
    const { Data, Template, MessageId } = this.state

    ParseEDI({ EDI: Data, Script: Template, MessageId: MessageId }).then(({ data }) => {
      try {
        this.setState({
          Output: data
        })
        enqueueSnackbar('Script Parsed', {
          variant: 'success'
        })
      } catch (jerr) {
        this.setState({
          Output: {
            Error: jerr.message
          }
        })
        enqueueSnackbar('Script Parse Failed', {
          variant: 'error'
        })
      }
    }).catch(displayRuleMessages)
  }

  onSplitResize = (name, newSize) => {
    this.setState({
      [`${name}Split`]: newSize || 0
    })
  }

  onMessageIdChange = (event) => {
    this.setState({
      MessageId: event.target.value
    })
  }

  render () {
    const { classes } = this.props
    const { Template, VSplit = 0, HSplit = 0, Data, Output, MessageId } = this.state

    return (
      <div className={classes.root}>
        <div className={classes.topBar}>
          <AppBar position='relative'>
            <Toolbar>
              <Typography variant="h6" className={classes.title}>
                (X12POC) React/Node EDI Parser
              </Typography>
              <FormControl color='primary' size='small' className={classes.menuOption} variant="outlined" >
                <InputLabel className={classes.menuOptionText} id="msgId-lab">Message Id</InputLabel>
                <Select
                  labelId="msgId-lab"
                  id="msdId"
                  label="Message Id"
                  value={MessageId}
                  onChange={this.onMessageIdChange}
                  className={classes.menuOptionText}
                  InputProps={{
                    classes: {
                      root: classes.menuOptionOutline,
                      notchedOutline: classes.notchedOutline
                    }
                  }}
                >
                  <MenuItem value='270'>270</MenuItem>
                  <MenuItem value='271'>271</MenuItem>
                  <MenuItem value='835'>835</MenuItem>
                </Select>
              </FormControl>
            </Toolbar>
          </AppBar>
        </div>
        <div className={classes.body}>
          <SplitPane pane1Style={{ overflow: 'auto' }} split="vertical" onDragFinished={this.onSplitResize.bind(this, 'V')} minSize={'100px'} defaultSize={'50%'}>
            <ReactJson src={Output}/>
            <SplitPane split="horizontal" onDragFinished={this.onSplitResize.bind(this, 'H')} minSize={'100px'} defaultSize={'50%'}>
              <TemplateEditor value={Template} splitSize={VSplit + HSplit} onChange={(val) => { this.setState({ Template: val }) }} />
              <DataEditor value={Data} splitSize={VSplit + HSplit} onChange={(val) => { this.setState({ Data: val }) }} />
            </SplitPane>
          </SplitPane>
        </div>
      </div>
    )
  }
}

export const ParseDemo = compose(
  withSnackbar,
  withStyles(styles),
  WithQuery({
    stateKey: 'ParseDemo',
    actions: [
      {
        url: '/Services/EDI/Parse',
        prop: 'ParseEDI'
      }
    ]
  }),
  WithMessageBus({
    channels: [
      DataEditorChannels.DataUpdate,
      TemplateEditorChannels.TemplateUpdate
    ]
  })
)(ParseDemoPlain)

export default ParseDemoPlain
