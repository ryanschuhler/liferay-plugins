/**
 * Copyright (c) 2000-2013 Liferay, Inc. All rights reserved.
 *
 * This library is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Lesser General Public License as published by the Free
 * Software Foundation; either version 2.1 of the License, or (at your option)
 * any later version.
 *
 * This library is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more
 * details.
 */

package com.liferay.so.activities.hook.social;

import com.liferay.microblogs.model.MicroblogsEntry;
import com.liferay.microblogs.service.MicroblogsEntryLocalServiceUtil;
import com.liferay.microblogs.service.permission.MicroblogsEntryPermission;
import com.liferay.microblogs.util.MicroblogsUtil;
import com.liferay.portal.kernel.exception.PortalException;
import com.liferay.portal.kernel.exception.SystemException;
import com.liferay.portal.kernel.util.StringBundler;
import com.liferay.portal.kernel.util.StringPool;
import com.liferay.portal.model.User;
import com.liferay.portal.security.permission.ActionKeys;
import com.liferay.portal.security.permission.PermissionChecker;
import com.liferay.portal.service.ServiceContext;
import com.liferay.portal.service.UserLocalServiceUtil;
import com.liferay.portlet.social.model.SocialActivity;
import com.liferay.portlet.social.model.SocialActivitySet;
import com.liferay.portlet.social.service.SocialActivityLocalServiceUtil;
import com.liferay.portlet.social.service.SocialActivitySetLocalServiceUtil;

/**
 * @author Matthew Kong
 */
public class MicroblogsActivityInterpreter extends SOSocialActivityInterpreter {

	public String[] getClassNames() {
		return _CLASS_NAMES;
	}

	@Override
	public void updateActivitySet(long activityId)
		throws PortalException, SystemException {

		SocialActivity activity =
			SocialActivityLocalServiceUtil.fetchSocialActivity(activityId);

		if ((activity == null) || (activity.getActivitySetId() > 0)) {
			return;
		}

		long activitySetId = getActivitySetId(activityId);

		if (activitySetId > 0) {
			SocialActivitySetLocalServiceUtil.incrementActivityCount(
				activitySetId, activityId);
		}
		else {
			SocialActivitySet activitySet =
				SocialActivitySetLocalServiceUtil.addActivitySet(activityId);

			if (activity.getType() == _ACTIVITY_KEY_REPLY_ENTRY) {
				MicroblogsEntry microblogsEntry =
					MicroblogsEntryLocalServiceUtil.fetchMicroblogsEntry(
						activity.getClassPK());

				if (microblogsEntry == null) {
					return;
				}

				activitySet.setClassPK(
					microblogsEntry.getReceiverMicroblogsEntryId());

				SocialActivitySetLocalServiceUtil.updateSocialActivitySet(
					activitySet);
			}
		}
	}

	@Override
	protected long getActivitySetId(long activityId) {
		try {
			SocialActivitySet activitySet = null;

			SocialActivity activity =
				SocialActivityLocalServiceUtil.getActivity(activityId);

			if (activity.getType() == _ACTIVITY_KEY_REPLY_ENTRY) {
				MicroblogsEntry microblogsEntry =
					MicroblogsEntryLocalServiceUtil.fetchMicroblogsEntry(
						activity.getClassPK());

				if (microblogsEntry == null) {
					return 0;
				}

				activitySet =
					SocialActivitySetLocalServiceUtil.getClassActivitySet(
						activity.getClassNameId(),
						microblogsEntry.getReceiverMicroblogsEntryId(),
						activity.getType());
			}

			if ((activitySet != null) && !isExpired(activitySet, true)) {
				return activitySet.getActivitySetId();
			}
		}
		catch (Exception e) {
		}

		return 0;
	}

	protected String getBody(
			long classPK, int type, ServiceContext serviceContext)
		throws Exception {

		if (type == _ACTIVITY_KEY_ADD_ENTRY) {
			return StringPool.BLANK;
		}

		MicroblogsEntry microblogsEntry =
			MicroblogsEntryLocalServiceUtil.fetchMicroblogsEntry(classPK);

		if (microblogsEntry == null) {
			return StringPool.BLANK;
		}

		if (microblogsEntry.getReceiverMicroblogsEntryId() > 0) {
			microblogsEntry =
				MicroblogsEntryLocalServiceUtil.fetchMicroblogsEntry(
					microblogsEntry.getReceiverMicroblogsEntryId());

			if (microblogsEntry == null) {
				return StringPool.BLANK;
			}
		}

		StringBundler sb = new StringBundler(12);

		sb.append("<div class=\"activity-body-container\">");
		sb.append("<div class=\"activity-body\">");
		sb.append("<div class=\"user-portrait\"><span class=\"avatar\">");
		sb.append("<a href=\"");

		User user = UserLocalServiceUtil.fetchUser(microblogsEntry.getUserId());

		if (user != null) {
			sb.append(user.getDisplayURL(serviceContext.getThemeDisplay()));
		}

		sb.append("\"><img alt=\"");

		if (user != null) {
			sb.append(user.getFullName());
		}

		sb.append("\" src=");

		if (user != null) {
			sb.append(user.getPortraitURL(serviceContext.getThemeDisplay()));
		}

		sb.append("\"/></a></span></div><span class=\"microblog-content\">");
		sb.append(
			MicroblogsUtil.getTaggedContent(microblogsEntry, serviceContext));
		sb.append("</span></div></div>");

		return sb.toString();
	}

	@Override
	protected String getBody(
			SocialActivity activity, ServiceContext serviceContext)
		throws Exception {

		return getBody(
			activity.getClassPK(), activity.getType(), serviceContext);
	}

	@Override
	protected String getBody(
			SocialActivitySet activitySet, ServiceContext serviceContext)
		throws Exception {

		return getBody(
			activitySet.getClassPK(), activitySet.getType(), serviceContext);
	}

	@Override
	protected String getLink(
			SocialActivity activity, ServiceContext serviceContext)
		throws Exception {

		return wrapLink(
			getLinkURL(
				activity.getClassName(), activity.getClassPK(), serviceContext),
			serviceContext.translate("view-microblogs"));
	}

	@Override
	protected String getLink(
			SocialActivitySet activitySet, ServiceContext serviceContext)
		throws Exception {

		return wrapLink(
			getLinkURL(
				activitySet.getClassName(), activitySet.getClassPK(),
				serviceContext),
			serviceContext.translate("view-microblogs"));
	}

	protected String getTitle(
			long activitySetId, long classPK, long groupId, long userId,
			long displayDate, int activityType, ServiceContext serviceContext)
		throws Exception {

		StringBundler sb = new StringBundler(4);

		sb.append(
			getTitle(
				activitySetId, groupId, userId, displayDate, serviceContext));
		sb.append("<div class=\"activity-action\">");

		if (activityType == _ACTIVITY_KEY_REPLY_ENTRY) {
			sb.append(
				serviceContext.translate("commented-on-a-microblog-entry"));
		}
		else {
			MicroblogsEntry microblogsEntry =
				MicroblogsEntryLocalServiceUtil.fetchMicroblogsEntry(classPK);

			if (microblogsEntry == null) {
				return StringPool.BLANK;
			}

			if (activityType == _ACTIVITY_KEY_ADD_ENTRY) {
				sb.append(
					MicroblogsUtil.getTaggedContent(
						microblogsEntry, serviceContext));
			}
			else if (activityType == _ACTIVITY_KEY_REPOST_ENTRY) {
				sb.append(
					serviceContext.translate(
						"reposted-a-microblog-entry-from-x",
						getUserName(
							microblogsEntry.getReceiverUserId(),
							serviceContext)));
			}
			else {
				return StringPool.BLANK;
			}
		}

		sb.append("</div>");

		return sb.toString();
	}

	@Override
	protected String getTitle(
			SocialActivity activity, ServiceContext serviceContext)
		throws Exception {

		return getTitle(
			0, activity.getClassPK(), activity.getGroupId(),
			activity.getUserId(), activity.getCreateDate(), activity.getType(),
			serviceContext);
	}

	@Override
	protected String getTitle(
			SocialActivitySet activitySet, ServiceContext serviceContext)
		throws Exception {

		return getTitle(
			activitySet.getActivitySetId(), activitySet.getClassPK(),
			activitySet.getGroupId(), activitySet.getUserId(),
			activitySet.getModifiedDate(), activitySet.getType(),
			serviceContext);
	}

	@Override
	protected boolean hasPermissions(
			PermissionChecker permissionChecker, SocialActivity activity,
			String actionId, ServiceContext serviceContext)
		throws Exception {

		MicroblogsEntry microblogsEntry =
			MicroblogsEntryLocalServiceUtil.getMicroblogsEntry(
				activity.getClassPK());

		return MicroblogsEntryPermission.contains(
			permissionChecker, microblogsEntry, ActionKeys.VIEW);
	}

	/**
	 * {@link
	 * com.liferay.microblogs.microblogs.social.MicroblogsActivityKeys#ADD_ENTRY}
	 */
	private static final int _ACTIVITY_KEY_ADD_ENTRY = 1;

	/**
	 * {@link
	 * com.liferay.microblogs.microblogs.social.MicroblogsActivityKeys#REPLY_ENTRY}
	 */
	private static final int _ACTIVITY_KEY_REPLY_ENTRY = 3;

	/**
	 * {@link
	 * com.liferay.microblogs.microblogs.social.MicroblogsActivityKeys#REPOST_ENTRY}
	 */
	private static final int _ACTIVITY_KEY_REPOST_ENTRY = 2;

	private static final String[] _CLASS_NAMES =
		{MicroblogsEntry.class.getName()};

}