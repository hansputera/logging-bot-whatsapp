const [
    assert,
    isGitDirty
] = [
    require('assert'),
    require('is-git-dirty'),
];

const isDirty = isGitDirty();

assert.notEqual(isDirty, null);
assert.notEqual(isDirty, false);
assert.ok(isDirty);
