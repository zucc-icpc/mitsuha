import React from "react";
import { withRouter } from "react-router-dom";

// core components
import Wizard from "components/Wizard/Wizard.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";

import Step1 from "./TemplateCreateSteps/Step1.jsx"
import Step2 from "./TemplateCreateSteps/Step2.jsx"
import { templateCreateAPI } from "../../utils/api.js";

class TemplateCreate extends React.Component {
  handleSubmit = async (e) => {
    console.log(e)
    const { title, intro } = e.step1
    const type = e.step2.selected
    const file = e.step2.files[0]
    await templateCreateAPI(title, intro, type, file)
    this.props.history.push('/template')
  }

  render() {
    return (
      <GridContainer justify="center">
        <GridItem xs={12} sm={8}>
          <Wizard
            validate
            steps={[
              { stepName: "基本信息", stepComponent: Step1, stepId: "step1" },
              { stepName: "模版类型", stepComponent: Step2, stepId: "step2" },
            ]}
            title="创建你的模版"
            subtitle="上传本地已有的PDF或WORD文件"
            finishButtonClick={e => this.handleSubmit(e)}
          />
        </GridItem>
      </GridContainer>
    );
  }
}

export default withRouter(TemplateCreate);

