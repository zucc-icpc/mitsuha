import React from "react";

// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Heading from "components/Heading/Heading.jsx";
import Timeline from "components/Timeline/Timeline.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";

// @material-ui/icons
import Grade from "@material-ui/icons/Grade";
import Gavel from "@material-ui/icons/Gavel";
import TurnedInNot from "@material-ui/icons/TurnedInNot";
import { honorListAPI } from "../../utils/api";
import { updateHonors } from "../../store/actions";
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux'
import { get } from 'lodash';
import Button from "components/CustomButtons/Button.jsx";

class HonorList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      stories: []
    };
  }

  getBadgeIcon = (type) => {
    if (type === '大事件') {
      return Gavel
    }
    if (type === '其他') {
      return TurnedInNot
    }
    return Grade
  }

  getbadgeColor = (type) => {
    if (type === '大事件') {
      return 'danger'
    }
    if (type === '其他') {
      return 'info'
    }
    if (type === 'ICPC') {
      return 'danger'
    }
    if (type === 'CCPC') {
      return 'warning'
    } 
    return 'success'
  }

  componentDidMount = async () => {
    const id = this.props.id
    const data = await honorListAPI()
    // const sortedData = data.sort((a, b) => {
    //   if (a.time < b.time) {
    //     return -1
    //   }
    //   if (a.time > b.time) {
    //     return 1
    //   }
    //   return 0
    // })
    console.log('data', data)
    this.props.updateHonors(data)
    const stories = data.map((item, idx) => {
      const inverted = idx % 2 === 0
      const {id, intro, type, time, } = item
      const title = `${type}-${time}`
      const badgeIcon = this.getBadgeIcon(type)
      const badgeColor = this.getbadgeColor(type)
      const titleColor = this.getbadgeColor(type)
      return {
        id,
        inverted,
        badgeColor,
        badgeIcon,
        title,
        titleColor,
        body: (
          <p>
            {intro}
          </p>
        )
      }
    })
    this.setState({
      stories
    })
  }

  render() {
    return (
      <div>
        <Heading title="实验室的故事" textAlign="center" />
        <GridContainer>
          {this.props.user.type === '教练' || this.props.user.isStaff === 'True' ? (
            <GridItem>
              <Button 
                color="primary"
                onClick={() => {
                  this.props.history.push('/create-honor/')
                }}
              >
                新建故事
              </Button>
            </GridItem>
          ):null}
          <GridItem xs={12}>
            <Card plain>
              <CardBody plain>
                <Timeline stories={this.state.stories} />
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  updateHonors: (payload) => dispatch(updateHonors(payload)),
})


const mapStateToProps = state => ({
  user: get(state, 'user'),
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(HonorList));
