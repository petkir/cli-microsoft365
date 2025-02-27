import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';
import * as sinon from 'sinon';
import { sinonUtil } from '../../../../../../utils/sinonUtil';
import { Project } from '../../project-model';
import { Finding } from '../../report-model';
import { FN018003_TEAMS_tab20x20_png } from './FN018003_TEAMS_tab20x20_png';

describe('FN018003_TEAMS_tab20x20_png', () => {
  let findings: Finding[];
  let rule: FN018003_TEAMS_tab20x20_png;
  afterEach(() => {
    sinonUtil.restore(fs.existsSync);
  });

  beforeEach(() => {
    findings = [];
    rule = new FN018003_TEAMS_tab20x20_png();
  });

  it('returns empty resolution by default', () => {
    assert.strictEqual(rule.resolution, '');
  });

  it('returns empty file name by default', () => {
    assert.strictEqual(rule.file, '');
  });

  it('doesn\'t return notifications if no manifests are present', () => {
    const project: Project = {
      path: '/usr/tmp'
    };
    rule.visit(project, findings);
    assert.strictEqual(findings.length, 0);
  });

  it('doesn\'t return notifications if the icon exists', () => {
    sinon.stub(fs, 'existsSync').callsFake(() => true);
    const project: Project = {
      path: '/usr/tmp',
      manifests: [{
        $schema: 'schema',
        id: 'c93e90e5-6222-45c6-b241-995df0029e3c',
        componentType: 'WebPart',
        path: '/usr/tmp/webpart'
      }]
    };
    rule.visit(project, findings);
    assert.strictEqual(findings.length, 0);
  });

  it('returns path to icon with the specified name when fixed name used', () => {
    rule = new FN018003_TEAMS_tab20x20_png('tab20x20.png');
    sinon.stub(fs, 'existsSync').callsFake(() => false);
    const project: Project = {
      path: '/usr/tmp',
      manifests: [{
        $schema: 'schema',
        id: 'c93e90e5-6222-45c6-b241-995df0029e3c',
        componentType: 'WebPart',
        path: '/usr/tmp/webpart'
      }]
    };
    rule.visit(project, findings);
    assert.strictEqual(findings[0].occurrences[0].file, path.join('teams', 'tab20x20.png'));
  });

  it('returns path to icon with name following web part ID when no fixed name specified', () => {
    sinon.stub(fs, 'existsSync').callsFake(() => false);
    const project: Project = {
      path: '/usr/tmp',
      manifests: [{
        $schema: 'schema',
        id: 'c93e90e5-6222-45c6-b241-995df0029e3c',
        componentType: 'WebPart',
        path: '/usr/tmp/webpart'
      }]
    };
    rule.visit(project, findings);
    assert.strictEqual(findings[0].occurrences[0].file, path.join('teams', 'c93e90e5-6222-45c6-b241-995df0029e3c_outline.png'));
  });

  it(`doesn't return notification when web part ID not specified`, () => {
    sinon.stub(fs, 'existsSync').callsFake(() => false);
    const project: Project = {
      path: '/usr/tmp',
      manifests: [{
        $schema: 'schema',
        componentType: 'WebPart',
        path: '/usr/tmp/webpart'
      }]
    };
    rule.visit(project, findings);
    assert.strictEqual(findings.length, 0);
  });
});