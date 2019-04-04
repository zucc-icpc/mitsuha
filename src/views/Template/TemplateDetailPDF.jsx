import React from "react";
import PropTypes from "prop-types";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

// core components
import Quote from "components/Typography/Quote.jsx";
import Muted from "components/Typography/Muted.jsx";
import Primary from "components/Typography/Primary.jsx";
import Info from "components/Typography/Info.jsx";
import Success from "components/Typography/Success.jsx";
import Warning from "components/Typography/Warning.jsx";
import Danger from "components/Typography/Danger.jsx";
import Heading from "components/Heading/Heading.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import { Document, Page, pdfjs} from 'react-pdf';
import { templateDetailAPI } from "../../utils/api"
import { Button } from "@material-ui/core";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const style = {
  typo: {
    // paddingLeft: "25%",
    marginBottom: "40px",
    position: "relative"
  },
  note: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    bottom: "10px",
    color: "#c0c1c2",
    display: "block",
    fontWeight: "400",
    fontSize: "13px",
    lineHeight: "13px",
    left: "0",
    marginLeft: "20px",
    position: "absolute",
    width: "260px"
  }
};

class templateDetailPDF extends React.Component {

  componentDidMount = async () => {
    const data = await templateDetailAPI(this.props.match.params.id);
    this.setState({
      pdf: data["pdf"],
      title: data["title"],
      owner: data["owner"],
    })
  }

  constructor(props) {
    super(props);
    this.state = {
      pdf: "",
      title: "",
      owner: "",
      numPages: null,
      pageNumber: 1,
    }
  }

  onDocumentLoadSuccess = ({ numPages }) => {
    this.setState({ numPages });
  }

  render() {
    const { classes } = this.props
    const { pageNumber, numPages } = this.state;
    return (
      <div>
        <Heading
          textAlign="center"
          title={this.state.title}
          category={`作者：${this.state.owner}`}
        />
        {this.state.pdf === "" ? (
          <GridContainer>
            <GridItem>
              <Button>上传PDF</Button>
            </GridItem>
          </GridContainer>
        ) : (
          window.open(this.state.pdf, "_blank")
        )}
      </div>
    );
  }
}

templateDetailPDF.propTypes = {
  classes: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired
};

export default withStyles(style)(templateDetailPDF);
