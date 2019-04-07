import React from "react";

// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Heading from "components/Heading/Heading.jsx";
import Timeline from "components/Timeline/Timeline.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CustomDropdown from "components/CustomDropdown/CustomDropdown.jsx";

// @material-ui/icons
import CardTravel from "@material-ui/icons/CardTravel";
import Extension from "@material-ui/icons/Extension";
import Fingerprint from "@material-ui/icons/Fingerprint";
import FlightLand from "@material-ui/icons/FlightLand";
import Build from "@material-ui/icons/Build";
import Grade from "@material-ui/icons/Grade";
import Gavel from "@material-ui/icons/Gavel";
import TurnedInNot from "@material-ui/icons/TurnedInNot";
import { honorListAPI } from "../../utils/api";

const tempStories = [
  {
    // First story
    inverted: true,
    badgeColor: "danger",
    badgeIcon: CardTravel,
    title: "Some Title",
    titleColor: "danger",
    body: (
      <p>
        Wifey made the best Father's Day meal ever. So thankful so happy so
        blessed. Thank you for making my family We just had fun with the
        “future” theme !!! It was a fun night all together ... The always rude
        Kanye Show at 2am Sold Out Famous viewing @ Figueroa and 12th in
        downtown.
      </p>
    ),
    footerTitle: "11 hours ago via Twitter"
  },
  {
    // Second story
    badgeColor: "success",
    badgeIcon: Extension,
    title: "Another One",
    titleColor: "success",
    body: (
      <p>
        Thank God for the support of my wife and real friends. I also wanted to
        point out that it’s the first album to go number 1 off of streaming!!! I
        love you Ellen and also my number one design rule of anything I do from
        shoes to music to homes is that Kim has to like it....
      </p>
    )
  },
  {
    // Third story
    inverted: true,
    badgeColor: "info",
    badgeIcon: Fingerprint,
    title: "Another Title",
    titleColor: "info",
    body: (
      <div>
        <p>
          Called I Miss the Old Kanye That’s all it was Kanye And I love you
          like Kanye loves Kanye Famous viewing @ Figueroa and 12th in downtown
          LA 11:10PM
        </p>
        <p>
          What if Kanye made a song about Kanye Royère doesn't make a Polar bear
          bed but the Polar bear couch is my favorite piece of furniture we own
          It wasn’t any Kanyes Set on his goals Kanye
        </p>
      </div>
    ),
    footer: (
      <CustomDropdown
        buttonIcon={Build}
        buttonProps={{
          round: true,
          style: { marginBottom: "0" },
          color: "info"
        }}
        dropdownList={[
          "Action",
          "Another action",
          "Something else here",
          { divider: true },
          "Separated link"
        ]}
      />
    )
  },
  {
    // Fourth story
    badgeColor: "warning",
    badgeIcon: FlightLand,
    title: "Another One",
    titleColor: "warning",
    body: (
      <p>
        Tune into Big Boy's 92.3 I'm about to play the first single from Cruel
        Winter also to Kim’s hair and makeup Lorraine jewelry and the whole
        style squad at Balmain and the Yeezy team. Thank you Anna for the invite
        thank you to the whole Vogue team
      </p>
    )
  }
];


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
