 -- Update view in order to show total number of calls correctly
DROP VIEW dashboard_by_account;
CREATE OR REPLACE VIEW
  dashboard_by_account
with
  (security_invoker = true) AS (
    select
      organization_id,
      CAST(grouped_donations.total_sum_donations as INTEGER),
      CAST(grouped_donations.number_of_donations as INTEGER),
      CAST(
        grouped_pledges.total_sum_unfufilled_pledges as INTEGER
      ),
      CAST(
        grouped_pledges.number_of_unfufilled_pledges as INTEGER
      ),
      COALESCE(total_number_of_calls,0) as total_number_of_calls
    from
      (
        select
          sum(amount) as total_sum_donations,
          count(*) as number_of_donations,
          organization_id
        from
          donations
        group by
          organization_id
      ) grouped_donations
      full outer join (
        select
          sum(amount) as total_sum_unfufilled_pledges,
          count(*) as number_of_unfufilled_pledges,
          organization_id
        from
          pledges
          /*where fufilled!=true*/
        group by
          organization_id
      ) grouped_pledges using (organization_id)
      full outer join (
        select
          count(*) as total_number_of_calls,
          organization_id
        from
          interactions
        where
          contact_type = 'call'
        group by
          organization_id
      ) calls using (organization_id)
  );
