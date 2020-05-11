import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import { compose } from 'redux'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import SplitPane from 'react-split-pane'
import { WithMessageBus, WithQuery } from 'common-tools/index'
import { OutputViewer } from './OutputViewer'
import ReactJson from 'react-json-view'
import { TemplateEditor, TemplateEditorChannels } from './TemplateEditor'
import { DataEditor, DataEditorChannels } from './DataEditor'

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
  title: {
    flexGrow: 1
  }
})

export class ParseDemoPlain extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      Template: '',
      Data: `ISA*00*Authorizat*00*Security        I*ZZ*Interchange      Sen*ZZ*Interchange Rec*141001*1037*^*00501*000031033*0*T*:~
GS*HS*Sample Sen*Sample Rec*20141001*1037*123456*X*005010X279A1~
ST*270*1234*005010X279A1~
BHT*0022*13*10001234*20141001*1319~
HL*1**20*1~
NM1*PR*2*ABC COMPANY*****PI*842610001~
HL*2*1*21*1~
NM1*1P*2*BONE AND JOINT CLINIC*****XX*1234567893~
HL*3*2*22*0~
TRN*1*93175-0001*9877281234~
NM1*IL*1*SMITH*ROBERT****MI*11122333301~
DMG*D8*19430519~
DTP*291*D8*20141001~
EQ*30~
SE*13*1234~
GE*1*123456~
IEA*1*000031033~`,
      VSplit: 0,
      HSplit: 0,
      Output: {}
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
    const { ParseEDI } = this.props
    const { Data, Template } = this.state
    try {
      ParseEDI({ RawEDI: Data, Map: JSON.parse(Template) }).then(({ data }) => {
        try {
          this.setState({
            Output: JSON.parse(data)
          })
        } catch (jerr) {
          this.setState({
            Output: {
              Error: jerr.message
            }
          })
        }
      })
    } catch (err) {
      this.setState({
        Output: {
          Error: err.message
        }
      })
    }
  }

  onSplitResize = (name, newSize) => {
    this.setState({
      [`${name}Split`]: newSize || 0
    })
  }

  render () {
    const { classes } = this.props
    const { Template, VSplit = 0, HSplit = 0, Data, Output } = this.state

    return (
      <div className={classes.root}>
        <div className={classes.topBar}>
          <AppBar position='relative'>
            <Toolbar>
              <Typography variant="h6" className={classes.title}>
                (X12POC) React/Node EDI Parser
              </Typography>
            </Toolbar>
          </AppBar>
        </div>
        <div className={classes.body}>
          <SplitPane split="vertical" onDragFinished={this.onSplitResize.bind(this, 'V')} minSize={'100px'} defaultSize={'50%'}>
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
