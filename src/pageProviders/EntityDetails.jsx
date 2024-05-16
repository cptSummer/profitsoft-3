import PageContainer from './components/PageContainer';
import EntityDetailsPage from 'pages/entityDetails';
import React from "react";

const EntityDetails = (props) => {
    return (
        <PageContainer>
            <EntityDetailsPage {...props} />
        </PageContainer>
    );
};
export default EntityDetails;
