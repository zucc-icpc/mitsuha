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

class Honor extends React.Component {

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
    const sortedData = data.sort((a, b) => {
      if (a.time < b.time) {
        return -1
      }
      if (a.time > b.time) {
        return 1
      }
      return 0
    })
    const stories = sortedData.map((item, idx) => {
      const inverted = idx % 2 === 0
      const { detail, type, time, } = item
      const title = `${type}-${time}`
      const badgeIcon = this.getBadgeIcon(type)
      const badgeColor = this.getbadgeColor(type)
      const titleColor = this.getbadgeColor(type)
      return {
        inverted,
        badgeColor,
        badgeIcon,
        title,
        titleColor,
        body: (
          <p>
            {detail}
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

export default Honor;
