const gitGraph = new GitGraph({
    orientation: "horizontal",
    mode: "compact",
    template: "metro"
});
const DEFAULT_FONT = "normal 12pt Arial";
const FEATURE_COLOR = "#B5E4FE";
const HOTFIX_COLOR = "#FA8367";
const MASTER_COLOR = "#54D0A2";
const RELEASE_COLOR = "#53D3D5";
gitGraph.template.colors = [ FEATURE_COLOR, HOTFIX_COLOR, MASTER_COLOR, FEATURE_COLOR, FEATURE_COLOR ];
gitGraph.template.branch = { ...gitGraph.template.branch,
    labelRotation: 0,
    showLabel: true,
    lineWidth: 6,
    mergeStyle: "bezier"
};
gitGraph.template.commit.dot.size = 8;
gitGraph.template.commit.spacingX = -30;
gitGraph.template.commit.message = { font: "normal 34pt Arial" };

// Create 'master' and 'release/2.0
const master = gitGraph.branch({ name: "master", column: 2 }).commit({ tag: "v1.0" , labelFont: DEFAULT_FONT }).commit();
const release = master.branch({ name: "release/2.0", column: 3 });
// Create 'feature/a' and 'feature/b'
const feature_a = release.branch({ name: "feature/a", column: 4 });
const feature_b = release.branch({ name: "feature/b", column: 5 });
// Do work on 'feature/a' and 'feature/b'
feature_a.commit({ labelFont: DEFAULT_FONT }).commit().commit().commit();
feature_b.commit({ labelFont: DEFAULT_FONT }).commit();
// Create 'hotfix/1.1'and 'feature/c' (Intended for Hotfix)
const hotfix = master.branch({ name: "hotfix/1.1", column: 1 });
// Merge 'feature/b' to 'release/2.0'
feature_a.merge(release, { labelFont: DEFAULT_FONT });
const feature_c = hotfix.branch({ name: "feature/c", column: 0 }).commit({ labelFont: DEFAULT_FONT });
// Do work on 'feature/c' then merge to 'hotfix/1.1'
feature_c.commit({ labelFont: DEFAULT_FONT })
    .commit()
    .merge(hotfix, { labelFont: DEFAULT_FONT, color: HOTFIX_COLOR });
// Finish 'hotfix/1.1' (Merge it to 'master' through to 'release/2.0')
hotfix.merge(master, { tag: "v1.1", color: MASTER_COLOR });
master.merge(release, { labelFont: DEFAULT_FONT, color: RELEASE_COLOR });
// Do more work on 'feature/b' then merge to 'release/2.0'
feature_b.commit()
    .commit()
    .merge(release);
// Finish 'release/2.0' (Merge it to 'master')
release.merge(master, { tag: "v2.0", font: DEFAULT_FONT, color: MASTER_COLOR });