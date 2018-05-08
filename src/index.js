/***********************
 *  CUSTOM TEMPLATES   *
 ***********************/
var gitGraph = new GitGraph({
    orientation: "horizontal",
    mode: "compact",
    template: "metro"
});
gitGraph.template.colors = ["#54D0A2", "#B18DE6", "#53D3D5", "#B5E4FE", "#B5E4FE", "#B5E4FE", "#FA8367", "#B5E4FE", "#B5E4FE"];
gitGraph.template.branch = { ...gitGraph.template.branch,
    labelRotation: 0,
    showLabel: true,
    lineWidth: 6,
    mergeStyle: "bezier"
};
gitGraph.template.commit.dot.size = 8;
gitGraph.template.commit.spacingX = -30;
gitGraph.template.commit.message = { font: "normal 34pt Arial" };

// Create master and develop
var master = gitGraph.branch({ name: "master", column: 0 }).commit({ labelFont: "normal 12pt Arial", tag: "v1.0" });
var develop = master.branch({ name: "develop", column: 1 });
// Create a Release
var release = develop.branch({ name: "release/2.0", column: 2 });
// Feature Branches, for Release
var feature_1 = release.branch({ name: "feature/1_NewDatePicker", column: 3 });
var feature_2 = release.branch({ name: "feature/2_I18N", column: 4});
var feature_3 = release.branch({ name: "feature/3_DocumentConversion", column: 5 });
// Create a Hotfix
var hotfix = master.branch({ name: "hotfix/1.1", column: 6});
// Feature Branches, for Hotfix
var feature_4 = release.branch({ name: "feature/4_BrokenLogin", column: 7 });
var feature_5 = release.branch({ name: "feature/5_SavingPreferences", column: 8 });

// Finish some work on Feature branches for Release
feature_1.commit({labelFont: "normal 12pt Arial"}).commit().commit().commit()
feature_2.commit({labelFont: "normal 12pt Arial"}).commit();
feature_3.commit({labelFont: "normal 12pt Arial"});
// Merge Feature branches for Release
feature_1.merge(release, {labelFont: "normal 12pt Arial"});
feature_3.merge(release);

// Finish work on Feature branches for Hotfix
feature_4.commit({labelFont: "normal 12pt Arial"});
feature_5.commit({labelFont: "normal 12pt Arial"});
// Merge Feature branches for Hotfix
feature_4.merge(hotfix, {labelFont: "normal 12pt Arial"});
feature_5.merge(hotfix);
// Finish Hotfix
hotfix.merge(release)
    .merge(develop, {labelFont: "normal 12pt Arial"})
    .merge(release)
    .merge(master, { tag: "v1.1", color: "#FA8367" });

// Finish more work on Feature branches for Release
feature_2.commit();
// Merge Feature branches for Release
feature_2.merge(release);
// Finish Release
release.merge(develop)
    .merge(master, { tag: "v2.0", color: "#53D3D5" });       
