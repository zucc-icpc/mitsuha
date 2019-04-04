import React from "react";

// core components
import Wizard from "components/Wizard/Wizard.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";

import Step1 from "./TemplateCreateSteps/Step1.jsx"
import Step2 from "./TemplateCreateSteps/Step2.jsx"
import Step3 from "./TemplateCreateSteps/Step3.jsx"


class TemplateCreate extends React.Component {
  render() {
    return (
      <GridContainer justify="center">
        <GridItem xs={12} sm={8}>
          <Wizard
            validate
            steps={[
              { stepName: "基本信息", stepComponent: Step1, stepId: "step1" },
              { stepName: "模版类型", stepComponent: Step2, stepId: "step2" },
              { stepName: "上传文件", stepComponent: Step3, stepId: "step3" },
              // { stepName: "上传模版", stepComponent: Step3, stepId: "step3" },
            ]}
            title="创建你的模版"
            subtitle="上传本地已有的PDF或WORD文件"
            finishButtonClick={e => console.log(e)}
          />
        </GridItem>
      </GridContainer>
    );
  }
}

export default TemplateCreate;
